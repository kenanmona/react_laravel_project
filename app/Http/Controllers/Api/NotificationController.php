<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function getNotifications()
    {
        $notes = Notification::get();
        return $notes;
    }
}
