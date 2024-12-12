<?php

namespace App\Http\Controllers\Auth;

use Auth;
use BaconQrCode\Renderer\ImageRenderer;
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

        $credentials = [
            $identifierType => $identifier,
            'password'=> $password,
            'user_status'=> 1, //User is active
        ];

        if(Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return response()->json(
                [
                    'message' => 'Login successful',
                    'user' => $user->only('type', 'username', 'email'),
                ],
                200
            );
        }
        return response()->json(['message'=> 'Invalid Username of Email'],401);
    }

    public function enable2FA(Request $request) {
        $user = $request->user();
        $google2fa = new Google2FA();

        $user->google2fa_secret = $google2fa->generateSecretKey();
        $user->google2fa_enabled = 1;
        $user->save();

        $google2fa_url = $google2fa->getQRCodeUrl(
            env('APP_NAME'),
            env('MAIL_FROM_NAME'),
            $user->google2fa_secret
        );

        $renderer = new ImageRenderer(
            new RendererStyle(400),
            new \BaconQrCode\Renderer\Image\SvgImageBackEnd()
        );
        $writer = new Writer($renderer);
        $qrCodeSvg = $writer->writeString($google2fa_url);
        $qrCodeUrl = 'data:image/svg+xml;base64,' . base64_encode($qrCodeSvg);

        return response()->json(['qrCodeUrl' => $qrCodeUrl], 200);
    }

    public function disable2FA(Request $request) {
        $user = $request->user();
        $user->google2fa_secret = null;
        $user->google2fa_enabled = 0;
        $user->save();

        return response()->json(['message' => '2FA disabled'], 200);
    }

    public function logout(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        return response()->json(['message'=> 'Logout successfull'], 200);
    }
}
