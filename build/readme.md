## Dependências
- NodeJS 16 ou superior

## Instuções de uso

- Execute no terminal `node compiler.js nomedoarquivo.txt` 
- `nomedoarquivo.txt` é o nome do arquivo contendo o código, a extensão de tal não importa assim como o nome.

## Output

O output do programa é dado em 3 partes, Lexico, sintático e semântico, como no exemplo abaixo:

```

-----------------------------------------

Lexical errors:

-----------------------------------------

Syntactic errors:

    MESSAGE: Expected variable declaration but found otherwise
    LINE: 7
    COLUMN: 6
    LINE WITH ERROR ---->  45 f = -1


-----------------------------------------

Semantic errors:

-----------------------------------------

```
> ### OBS
> Um erro acontecendo na etapa lexica irá bloquear a execução das etapas sintaticas e semanticas, assim como um erro na etapa sintatica irá bloquear a execução da etapa semantica

> Caso as sessão estejam vazias significa que não foram encontrados erros nas etapas em questão

## sample-code.txt

Código exemplo com erro semantico de declaração de variavel N

