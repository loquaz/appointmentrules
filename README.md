# Endpoints 
   * [Adicionar um dia específico](#add-day)
   * [Remover um dia específico](#del-day)
   * [Listar todos os dias disponíveis](#list-all)
   * [Listar horários disponíveis em intervalo de datas](#list-range)
   

<a name="add-day"></a>

##  Adicionar um dia específico
* Método de requisição: **POST**
* Path: **/appointment/day**
* Header: **Content-Type : application/json**
* Body: 
```json
{
  "type" : "day",
  "day" : "02-08-2018",
  "intervals" : [ {"start" : "05:00", "end" : "07:30"} ]
}
```
* Exemplo de resposta BEM sucedida
    * Status: **200** | **OK**
    * Body:
```json
{
    "id": "zAvq-xrrR",
    "day": "02-08-2018",
    "intervals": [
        {
            "start": "05:00",
            "end": "07:30"
        }
    ]
}
```
* Exemplo de resposta MAL sucedida
    * Status: **400** | **Bad Rquest**
    * Body:
```json
{
    "status": 400,
    "errorCode": 2,
    "errorType": "Resource already exists",
    "errorMessage": "Day appointment already exists"
}
```
<a name="del-day"></a>

##  Remover dia específico
* Método de requisição: **DELETE**
* Path: **/appointment/day/:id**
* Exemplo de resposta BEM sucedida
    * Status: **204** | **No Content**
    * Body: **vazio**
* Exemplo de resposta MAL sucedida
    * Status: **400** | **Bad Rquest**
    * Body:
```json
{
    "status": 404,
    "errorCode": 5,
    "errorType": "Resource not found",
    "errorMessage": "resource with id {WWizTAl0g} not found"
}
```

<a name="list-all"></a>

##  Listar todos os dias disponíveis
* Método de requisição: **GET**
* Path: **/appointment/days**
* Exemplo de resposta BEM sucedida
    * Status: **200** | **OK**
    * Body:
```json
[
    {
        "day": "15-06-2018",
        "intervals": [
            {
                "start": "05:00",
                "end": "07:30"
            }
        ]
    },
    {
        "day": "16-06-2018",
        "intervals": [
            {
                "start": "05:00",
                "end": "07:30"
            }
        ]
    },   
    {
        "day": "02-08-2018",
        "intervals": [
            {
                "start": "05:00",
                "end": "07:30"
            }
        ]
    }
]
```
<a name="list-range"></a>

##  Listar horários disponíveis em intervalo de datas
* Método de requisição: **GET**
* Path: **/appointment/available/:initDate/:endDate**
* Exemplo de resposta BEM sucedida
    * Status: **200** | **OK**
    * Body:
```json
[
    {
        "day": "16-06-2018",
        "intervals": [
            {
                "start": "05:00",
                "end": "07:30"
            }
        ]
    },
    {
        "day": "26-06-2018",
        "intervals": [
            {
                "start": "05:00",
                "end": "07:30"
            }
        ]
    },
    {
        "day": "29-07-2018",
        "intervals": [
            {
                "start": "05:00",
                "end": "07:30"
            }
        ]
    }
]
```
* Exemplo de resposta MAL sucedida
    * Status: **400** | **Bad Rquest**
    * Body:
```json
{
    "status": 400,
    "errorCode": 3,
    "errorType": "Request Error",
    "errorMessage": "16-16-2018, 29-07-2018 or both are invalid dates"
}
```
