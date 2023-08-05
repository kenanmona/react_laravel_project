<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\UpdateUserController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['token', 'api']], function () {
    // Route::apiResource("skills", SkillController::class)->middleware('role:admin');

    Route::get('/skills', [SkillController::class, 'index']);
    Route::get('/skills/{id}', [SkillController::class, 'show']);

    Route::group(['middleware' => 'role:admin'], function () {
        Route::post('/skills', [SkillController::class, 'store']);
        Route::put('/skills/{id}', [SkillController::class, 'update']);
        Route::delete('/skills/{id}', [SkillController::class, 'destroy']);
        Route::get("/notifications", [NotificationController::class, 'getNotifications']);
    });

    Route::post('/update-profile/{id}', [UpdateUserController::class, 'update']);
    Route::post('/change-password', [UpdateUserController::class, 'changePassword']);
    Route::post('/change-image', [UpdateUserController::class, 'changeImage']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth',
], function ($router) {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/user-profile', [AuthController::class, 'userProfile']);
});

Route::get('/me', [SkillController::class, 'tokenExpired']);
/*
Route::group(['middleware' => ['auth']], function () {
Route::resource('roles', RoleController::class);
Route::resource('users', UserController::class);
Route::resource('products', ProductController::class);
});
 */
