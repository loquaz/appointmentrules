# Endpoints 
   * [Adicionar um dia específico](#add-day)
   * [Remover um dia específico](#del-day)
   * [Listar todos os dias disponíveis](#list-all)
   * [Listar horários disponíveis em intervalo de datas](#list-range)
   * [Adicionar horários diáriamente](#add-daily)
   * [Remover regra de horários diários](#del-daily)
   * [Listar regra de horários diários](#list-daily)
   * [Adicionar horários semanalmente](#add-weekly)
   * [Remover regra de horários semanais](#del-weekly)
   * [Listar regra de horários semanais](#list-weekly)
   
   

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

<a name="add-daily"></a>

##  Adicionar horários diáriamente
* Método de requisição: **POST**
* Path: **/appointment/daily**
* Header: **Content-Type : application/json**
* Body: 
```json
{
  "type" : "daily",
  "intervals" : [{"start" : "08:10", "end" : "09:00"},{"start" : "10:00", "end" : "11:00"}]
}
```
* Exemplo de resposta BEM sucedida
    * Status: **200** | **OK**
    * Body:
```json
{
    "id": "aHIxbWJRS",
    "intervals": [
        {
            "start": "08:10",
            "end": "09:00"
        },
        {
            "start": "10:00",
            "end": "11:00"
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
    "errorMessage": "Daily appointment already exists"
}
```

<a name="del-daily"></a>

##  Remover regra de horários diários
* Método de requisição: **DELETE**
* Path: **/appointment/daily/:id**
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
    "errorMessage": "resource with id {MUm7Ptoxv} not found"
}
```

<a name="list-daily"></a>

##  Listar regra de horários diários
* Método de requisição: **GET**
* Path: **/appointment/daily**
* Exemplo de resposta BEM sucedida
    * Status: **200** | **OK**
    * Body:
```json
[
    {
        "intervals": [
            {
                "start": "08:10",
                "end": "09:00"
            },
            {
                "start": "10:00",
                "end": "11:00"
            }
        ]
    }
]
```

<a name="add-weekly"></a>

##  Adicionar horários semanalmente
* Método de requisição: **POST**
* Path: **/appointment/weekly**
* Header: **Content-Type : application/json**
* Body: 
```json
{
	"type" : "weekly",
	"days" : ["segunda", "quarta", "quinta", "sexta", "sabado"],
	"intervals" : [{"start": "12:00", "end": "16:00"}, {"start":"16:01", "end":"17:00"}]
}
```
* Exemplo de resposta BEM sucedida
    * Status: **200** | **OK**
    * Body:
```json
{
    "id": "6mW7brT13",
    "days": [
        "segunda",
        "quarta",
        "sexta",
        "quinta",
        "sabado"
    ],
    "intervals": [
        {
            "start": "12:00",
            "end": "16:00"
        },
        {
            "start": "16:01",
            "end": "17:00"
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
    "errorMessage": "Weekly appointment already exists"
}
```

<a name="del-weekly"></a>

##  Remover regra de horários semanais
* Método de requisição: **DELETE**
* Path: **/appointment/weekly/:id**
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
    "errorMessage": "resource with id {MUm7Ptoxv} not found"
}
```

<a name="list-weekly"></a>

##  Listar regra de horários semanais
* Método de requisição: **GET**
* Path: **/appointment/weekly**
* Exemplo de resposta BEM sucedida
    * Status: **200** | **OK**
    * Body:
```json
[
    {
        "days": [
            "segunda",
            "quarta",
            "sexta",
            "quinta",
            "sabado"
        ],
        "intervals": [
            {
                "start": "12:00",
                "end": "16:00"
            },
            {
                "start": "16:01",
                "end": "17:00"
            }
        ]
    }
]
```
