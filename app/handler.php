<?php
session_start();
new post_contact($_POST);

class post_contact
{

    public function __construct($post_data)
    {
        $this->send_contact_form($post_data["data"]);
    }

    function send_contact_form($data)
    {

        $main_email = 'vs@logicode.tech';

        if(isset($data['firstname']) && isset($data['email']))
        {

            // Main Email
            $headers = "MIME-Version: 1.0" . PHP_EOL .
                "Content-Type: text/html; charset=utf-8" . PHP_EOL .
                'From: '.$main_email.' <'.$main_email.'>' . PHP_EOL;

            $message = '<p style="color:purple">IP: <b>'.$_SERVER['REMOTE_ADDR'].'</b></p>';

            if(isset($data['firstname'])) {
                $message .= '<p>Name: <b>'.$data['firstname'].'</b></p>';
            }
            if(isset($data['email'])) {
                $message .= '<p>Email: <b>'.$data['email'].'</b></p>';
            }

            if(isset($data['client'])) {
                $message .= '<p>Client: <b>'.$data['client'].'</b></p>';
            }

            if(isset($data['budget'])) {
                $message .= '<p>Budget: <b>'.$data['budget'].'</b></p>';
            }

            if(isset($data['brief'])) {
                $message .= '<p>Brief: <b>'.$data['brief'].'</b></p>';
            }

            mail($main_email, 'From www.logicode.tech', $message, $headers );
            echo json_encode(array('status' => true));
        }
    }
}
