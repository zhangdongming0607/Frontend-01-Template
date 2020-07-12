<ME> ::= <Number>|<ME>*<Number>｜<DE>*<Number>

<DE> ::= <ME>/<Number>|<DE>/<Number>

<SE> ::= <SE>-<Number>|<AE>-<Number>｜<DE>-<Number>｜<ME>-<Number>

<AE> ::= <SE>+<Number>|<AE>+<Number>| <DE>+<Number>|<ME>+<Number>





```html
<MultiplicativeExpression> ::= <Number> ｜<MultiplicativeExpression> * <Number> | <MultiplicativeExpression>/<Number>
<AdditiveExpression>::=<MultiplicativeExpression> | <AdditiveExpression> + <MultiplicativeExpression> |<AdditiveExpression> - <MultiplicativeExpression>
<BucketExpression> ::=<AddtiveExpresssion> | (<BucketExpression> + <BucketExpression>)|(<BucketExpression> - <BucketExpression>)|(<BucketExpression> * <BucketExpression>)|(<BucketExpression> / <BucketExpression>)
  
```

