<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\AddSkill;
use Mail;

class MailController extends Controller
{
    public function index()
    {
        $mailData = [
            'title' => 'Mail From Kenan',
            'body' => 'This is Mail For YOU from smtp',
        ];
        Mail::to("kenan.mona.56789@gmail.com")->send(new AddSkill($mailData));
        dd('Email Send Successfuly');
    }
}
