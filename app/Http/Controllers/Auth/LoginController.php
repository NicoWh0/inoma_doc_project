<?php

namespace App\Http\Controllers\Auth;


use Auth;
use BaconQrCode\Renderer\ImageRenderer;
use Crypt;
use Hash;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use PragmaRX\Google2FA\Google2FA;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

class LoginController extends Controller
{
    public function login(Request $request) {
        $request->validate([
            'identifier' => 'required|string',
            'password'=> 'required|string',
        ]);

        $identifier = $request->input('identifier');
        $password = $request->input('password');
        $identifierType = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $user = User::where($identifierType, $identifier)->first();
        if(!$user) {
            return response()->json(['message'=> 'Invalid Username or Email'], 401);
        }

        if($user->user_status !== 1) {
            return response()->json(['message'=> 'User is not active'], 401);
        }

        $credentials = [
            $identifierType => $identifier,
            'password'=> $password,
            'user_status'=> 1, //User is active
        ];

        if(Hash::check($password, $user->password) && $user->google2fa_enabled) {
            $request->session()->put('2fa:user:id', $user->id);
            return response()->json([
                'message'=> 'Success, but 2FA required',
                'require2fa'=> true,
            ], 200);
        }

        if(Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return response()->json(
                [
                    'message' => 'Login successful',
                    'require2fa' => false,
                    'user' => $user->only('type', 'username', 'email', 'google2fa_enabled'),
                ],
                200
            );
        }
        return response()->json(['message'=> 'Invalid Username of Email'],401);
    }

    public function login2FA(Request $request) {
        $request->validate([
            'code' => 'required|numeric',
        ]);

        $userId = $request->session()->get('2fa:user:id');
        if (!$userId) {
            return response()->json(['message' => '2FA setup not initiated'], 401);
        }

        $user = User::where('id', $userId)->first();
        if (!$user) {
            return response()->json(['message' => 'Invalid User'], 401);
        }

        if (!$user->google2fa_enabled) {
            return response()->json(['message' => '2FA not enabled'], 401);
        }

        $google2fa = new Google2FA();
        $decryptedSecret = Crypt::decrypt($user->google2fa_secret);
        $valid = $google2fa->verifyKey($decryptedSecret, $request->input('code'));
        if ($valid) {
            Auth::login($user);
            $request->session()->regenerate();
            // Remove the session attribute after successful 2FA verification
            $request->session()->forget('2fa:user:id');
            return response()->json(
                [
                    'message' => 'Login successful',
                    'user' => $user->only('type', 'username', 'email', 'google2fa_enabled'),
                ],
                200
            );
        }

        return response()->json(['message' => 'Invalid 2FA code'], 401);
    }

    public function enable2FARequest(Request $request) {
        $user = $request->user();
        $google2fa = new Google2FA();

        if($user->google2fa_enabled) {
            return response()->json(['message' => '2FA already enabled'], 409);
        }
        if($user->google2fa_secret !== null) {
            $qrCodeUrl = $this->generateQRCode($google2fa, $user->google2fa_secret);
            return response()->json(['qrCodeUrl' => $qrCodeUrl], 200);
        }

        $user->google2fa_secret = Crypt::encrypt($google2fa->generateSecretKey());
        $user->save();

        $qrCodeUrl = $this->generateQRCode($google2fa, $user->google2fa_secret);

        //Return the QR code URL
        return response()->json(['qrCodeUrl' => $qrCodeUrl], 200);
    }

    public function enable2FAVerify(Request $request) {
        $request->validate([
            'code' => 'required|numeric',
        ]);

        $user = $request->user();

        if($user->google2fa_enabled) {
            return response()->json(['message' => '2FA already enabled'], 409);
        }
        if($user->google2fa_secret === null) {
            return response()->json(['message' => '2FA setup not initiated'], 401);
        }

        $google2fa = new Google2FA();

        $valid = $google2fa->verifyKey(
            Crypt::decrypt($user->google2fa_secret),
            $request->input('code')
        );

        if($valid) {
            $user->google2fa_enabled = 1;
            $user->save();
            return response()->json(['message' => '2FA enabled'], 200);
        }

        return response()->json(['message' => 'Invalid 2FA code'], 401);
    }

    public function disable2FA(Request $request) {
        $request->validate([
            'code' => 'required|numeric',
        ]);
        $user = $request->user();

        $google2fa = new Google2FA();

        $valid = $google2fa->verifyKey(
            Crypt::decrypt($user->google2fa_secret),
            $request->input('code')
        );
        if($valid) {
            $user->google2fa_secret = null;
            $user->google2fa_enabled = 0;
            $user->save();
            return response()->json(['message' => '2FA disabled'], 200);
        }
        return response()->json(['message' => 'Invalid 2FA code'], 401);
    }

    public function logout(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        return response()->json(['message'=> 'Logout successfull'], 200);
    }


    private function generateQRCode($google2fa, $google2fa_secret) {
        $google2fa_url = $google2fa->getQRCodeUrl(
            env('APP_NAME'),
            env('MAIL_FROM_NAME'),
            Crypt::decrypt($google2fa_secret)
        );
        $renderer = new ImageRenderer(
            new RendererStyle(400),
            new \BaconQrCode\Renderer\Image\SvgImageBackEnd()
        );
        $writer = new Writer($renderer);
        $qrCodeSvg = $writer->writeString($google2fa_url);
        return 'data:image/svg+xml;base64,' . base64_encode($qrCodeSvg);
    }
}
