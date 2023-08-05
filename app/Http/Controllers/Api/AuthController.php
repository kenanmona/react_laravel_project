<?php
namespace App\Http\Controllers\Api;

use App\Events\UserRegistered;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Notification;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        if (!$token = auth()->attempt($validator->validated())) {
            return response()->json(['error' => 'email or password is invalid'], 401);
        }
        return $this->createNewToken($token);
    }
    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users',
            'profile_image' => 'required|mimes:png,jpg,jpeg',
            'password' => 'required|string|confirmed|min:6',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $image = $request->profile_image;
        $name = time() . '.' . $image->getClientOriginalExtension();
        $image_path = $request->profile_image->storeAs('images', $name, 'public');

        $user = User::create(array_merge(
            $validator->validated(),
            [
                'password' => bcrypt($request->password),
            ],
        ));
        $user->email_verified_at = Carbon::now();
        $user->profile_image = 'http://127.0.0.1:8000/storage/'.$image_path;

        $user->assignRole('user');

        $user->save();

        $notify = Notification::create([
            'message' => $user->name . ' Has Already Been Registered',
            'user_id' => $user->id,
        ]);

        UserRegistered::dispatch($notify);

        return response()->json(["access_token" => Auth::login($user), "user" => new UserResource($user)]);
        return response()->json([
            'message' => 'User successfully registered',
            'user' => new UserResource($user),
        ], 201);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();
        return response()->json(['message' => 'User successfully signed out']);
    }
    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->createNewToken(auth()->refresh());
    }
    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function userProfile()
    {
        return response()->json(auth()->user());
    }
    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function createNewToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 24 * 10,
            'user' => new UserResource(auth()->user()),
        ]);
    }
}
