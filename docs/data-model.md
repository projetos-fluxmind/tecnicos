# Modelo de Dados Inicial

## Usuários

| Campo | Tipo | Observação |
| --- | --- | --- |
| id | uuid | Identificador principal |
| nome | string | Nome do usuário |
| email | string | Único |
| senha_hash | string | Nunca armazenar senha pura |
| perfil | enum | `OPERADOR`, `GESTOR`, `ADMIN` |
| ativo | boolean | Controle de acesso |
| criado_em | datetime | Auditoria |

## Técnicos

| Campo | Tipo | Observação |
| --- | --- | --- |
| id | uuid | Identificador principal |
| nome | string | Nome do técnico |
| matricula | string | Única |
| usuario_id | uuid | Opcional, FK para usuários |
| ativo | boolean | Permite desativar sem apagar histórico |

## Motos

| Campo | Tipo | Observação |
| --- | --- | --- |
| id | uuid | Identificador principal |
| placa | string | Única |
| km_atual | integer | Último KM validado |
| data_atualizacao_km | datetime | Última atualização |
| ativa | boolean | Controle de frota |

## Gastos de Alimentação

| Campo | Tipo | Observação |
| --- | --- | --- |
| id | uuid | Identificador principal |
| tecnico_id | uuid | FK para técnicos |
| valor | decimal | Valor da refeição |
| data_gasto | date | Data do gasto |
| excedeu_limite | boolean | `true` quando valor > 35 |

## Gastos de Abastecimento

| Campo | Tipo | Observação |
| --- | --- | --- |
| id | uuid | Identificador principal |
| tecnico_id | uuid | FK para técnicos |
| moto_id | uuid | FK para motos |
| valor | decimal | Valor pago |
| km_registrado | integer | KM informado |
| data_gasto | date | Data do gasto |

## Gastos de Manutenção

| Campo | Tipo | Observação |
| --- | --- | --- |
| id | uuid | Identificador principal |
| moto_id | uuid | FK para motos |
| valor | decimal | Valor gasto |
| descricao | text | Descrição da manutenção |
| data_gasto | date | Data do gasto |

## Gastos de Hospedagem

| Campo | Tipo | Observação |
| --- | --- | --- |
| id | uuid | Identificador principal |
| tecnico_id | uuid | FK para técnicos |
| valor | decimal | Valor pago |
| motivo | text | Motivo da hospedagem |
| data_gasto | date | Data do gasto |

## Recargas Flash

| Campo | Tipo | Observação |
| --- | --- | --- |
| id | uuid | Identificador principal |
| tecnico_id | uuid | FK para técnicos |
| valor | decimal | Valor da recarga |
| data_recarga | date | Data da recarga |
