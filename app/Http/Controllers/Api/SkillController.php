<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSkillRequest;
use App\Http\Resources\SkillCollection;
use App\Http\Resources\SkillResource;
use App\Mail\AddSkill;
use App\Models\Skill;
use App\Models\User;
use Mail;
use Tymon\JWTAuth\Facades\JWTAuth;

class SkillController extends Controller
{
    public function index()
    {
        if (auth()->user()) {
            $skills = new SkillCollection(Skill::get());

            return response()->json($skills);
        }
        return response()->json("you are not log in", 400);
        // $skills = new SkillCollection(Skill::paginate(1));
        // return $skills;
    }

    public function store(StoreSkillRequest $request)
    {
        if (auth()->user()) {
            Skill::create($request->validated());
            $skill = $request->validated();
            $users = User::get();
            foreach ($users as $user) {

                Mail::to($user->email)->send(new AddSkill($skill));
            }
            return response()->json("Skill Created");
        }
        return response()->json("you are not log in", 400);
    }

    public function show($id)
    {
        if (auth()->user()) {
            $skill = Skill::find($id);
            if ($skill) {
                return response()->json(new SkillResource($skill));
            } else if (!$skill) {
                return response()->json(["error" => "not found"], 404);
            }
        }
        return response()->json("you are not log in", 400);

    }

    public function update(StoreSkillRequest $request, $id)
    {
        if (auth()->user()) {
            $skill = Skill::find($id);
            if ($skill) {
                Skill::where("id", $id)->update($request->validated());
                return response()->json("Skill Updated");
            } else if (!$skill) {
                return response()->json(["error" => "not found"], 404);
            }
        }
        return response()->json("you are not log in", 400);
    }

    public function destroy($id)
    {
        if (auth()->user()) {
            $skill = Skill::find($id);
            if ($skill) {
                Skill::where("id", $id)->delete();
                return response()->json(["success" => "Skill Deleted"], 200);
            } else if (!$skill) {
                return response()->json(["error" => "not found"], 404);
            }
        }
        return response()->json("you are not log in", 400);
    }

    public function tokenExpired()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if ($user) {
                return response()->json(["message" => "Token is valid", "status" => 200], 200);
            }
        } catch (\Exception$e) {
            if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException) {
                return response()->json(["message" => "Token is Invalid", "status" => 401], 401);
            } else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException) {
                return response()->json(["message" => "Token is Expired", "status" => 401], 401);
            } else {
                return response()->json(["message" => "Authorization Token is not found", "status" => 404], 404);

            }
        }
        /* if (auth()->user()) {
    return response()->json("user valid");
    }
    return response()->json("user not valid"); */
    }
}
