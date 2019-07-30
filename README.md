# Endpoints

##  Adicionar de dia específico
**metodo de requisição**: POST

**path**: /appointment/day
**header**: Content-Type : application/json
**body** : 
```json
{
  "type" : "day",
  "day" : "02-08-2018",
  "intervals" : [ {"start" : "05:00", "end" : "07:30"} ]
}
```
**exemplo de resposta bem sucedida**
**status**: 200 | OK
**body** :
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
**exemplo de resposta MAL sucedida**
**status**: 400 | Bad Rquest
**body** :
```json
{
    "status": 400,
    "errorCode": 2,
    "errorType": "Resource already exists",
    "errorMessage": "Day appointment already exists"
}
```