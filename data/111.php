<?php
# Логин и пароль от личного кабинета PayKeeper
$user="demo";
$password="demo"; 
 
# Basic-авторизация передаётся как base64
$base64=base64_encode("$user:$password");         
$headers=Array(); 
array_push($headers,'Content-Type: application/x-www-form-urlencoded');
 
# Подготавливаем заголовок для авторизации
array_push($headers,'Authorization: Basic '.$base64);                                                  
 
# Укажите адрес ВАШЕГО сервера PayKeeper, адрес demo.paykeeper.ru - пример!
$server_paykeeper="https://demo.paykeeper.ru";           
 
# Параметры платежа, сумма - обязательный параметр
# Остальные параметры можно не задавать
$payment_data = array (
    "pay_amount" => 42.50,
    "clientid" => "Иванов Иван Иванович",
    "orderid" => "Заказ № 10",
    "client_email" => "test@example.com",
    "service_name" => "Услуга",
    "client_phone" => "8 (910) 123-45-67"
    );
 
# Готовим первый запрос на получение токена безопасности
$uri="/info/settings/token/";
 
# Для сетевых запросов в этом примере используется cURL
$curl=curl_init(); 
 
curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
curl_setopt($curl,CURLOPT_URL,$server_paykeeper.$uri);
curl_setopt($curl,CURLOPT_CUSTOMREQUEST,'GET');
curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
curl_setopt($curl,CURLOPT_HEADER,false);
 
# Инициируем запрос к API
$response=curl_exec($curl);                       
$php_array=json_decode($response,true);
 
# В ответе должно быть заполнено поле token, иначе - ошибка
if (isset($php_array['token'])) $token=$php_array['token']; else die();
 
 
# Готовим запрос 3.4 JSON API на получение счёта
$uri="/change/invoice/preview/";
 
# Формируем список POST параметров
$request = http_build_query(array_merge($payment_data, array ('token'=>$token)));
                
curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
curl_setopt($curl,CURLOPT_URL,$server_paykeeper.$uri);
curl_setopt($curl,CURLOPT_CUSTOMREQUEST,'POST');
curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
curl_setopt($curl,CURLOPT_HEADER,false);
curl_setopt($curl,CURLOPT_POSTFIELDS,$request);
 
 
$response=json_decode(curl_exec($curl),true);
# В ответе должно быть поле invoice_id, иначе - ошибка
if (isset($response['invoice_id'])) $invoice_id = $response['invoice_id']; else die();
 
# В этой переменной прямая ссылка на оплату с заданными параметрами
$link = "$server_paykeeper/bill/$invoice_id/";
 
# Теперь её можно использовать как угодно, например, выводим ссылку на оплату
echo $link;                                       
?>