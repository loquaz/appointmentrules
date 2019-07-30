# Endpoints

##  Adicionar de dia específico
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

##  Remover dia específico
* Método de requisição: **DELETE**
* Path: **/appointment/day/:id**

* Exemplo de resposta BEM sucedida
* Status: **204** | **No Content**
* Body: **vazio**

* Exemplo de resposta MAL sucedida
* Status: **400** | **Bad Rquest**
**body** :
```json
{
    "status": 404,
    "errorCode": 5,
    "errorType": "Resource not found",
    "errorMessage": "resource with id {WWizTAl0g} not found"
}
```