<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Rules\MatchOldPassword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Validator;

class UpdateUserController extends Controller
{
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        $user = User::findOrFail($id);
        if ($user) {
            $user->update($request->all(), ["updated_at" => Date::now()]);
            return response()->json(["user" => $user]);

        }
        return response()->json("you are not log in", 400);
    }
    public function changePassword(Request $request)
    {
        $userId = auth()->user()->id;
        // $validatedData = $request->validate([
        //     'current_password' => ['required', new MatchOldPassword],
        //     'new_password' => ['required'],
        //     'confirm_password' => ['required', 'same:new_password'],
        // ]);
        $validatedData = Validator::make($request->all(), [
            'current_password' => ['required', new MatchOldPassword],
            'new_password' => ['required', 'min:6'],
            'confirm_password' => ['required', 'same:new_password'],
        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors(), 422);
        }
        User::where('id', $userId)->update([
            'password' => bcrypt($request->new_password),
        ]);
        return response()->json(["Password Changed Successfuly"]);
    }
    public function changeImage(Request $request)
    {
        $userId = auth()->user()->id;

        $validatedData = Validator::make($request->all(), [
            'profile_image' => 'required|mimes:png,jpg,jpeg',
        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors(), 422);
        }

        $image = $request->profile_image;
        $name = time() . '.' . $image->getClientOriginalExtension();
        $image_path = $request->profile_image->storeAs('images', $name, 'public');

        User::where('id', $userId)->update([
            'profile_image' => 'http://127.0.0.1:8000/storage/'.$image_path,
        ]);
        return response()->json(["Image Profile Changed Successfuly"]);
    }
}
