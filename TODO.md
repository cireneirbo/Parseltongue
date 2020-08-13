# PyScript
## Task to accomplish
1. optional parenthesis around conditionals []
2. indent-based block scope []
3. line-end colon to indicate new block instead of curly brackets (if, while) []
4. self instead of this []
5. no constructor, instead __init__ []
6. access modifiers for methods and properties []
7. string literals []
8. AND []
9. OR []

### 1. Optional parenthesis around conditionals
##### Python
```python
if number > 0:
    sign = "positive"
elif number < 0:
    sign = "negative"
else:
    sign = "neutral"
```

or


```python
if (number > 0):
    sign = "positive"
elif (number < 0):
    sign = "negative"
else:
    sign = "neutral"

```


##### Javascript
```javascript
let sign = "";

if (number > 0) {
    sign = "positive";
} else if (number < 0) {
    sign = "negative";
} else {
    sign = "neutral";
}
```

### 2. Indent Block Scope
##### Python
```python
def get_sign(number):
    if number > 0:
        sign = "positive"
    elif number < 0:
        sign = "negative"
    else:
        sign = "neutral"
    return number
```

##### Javascript
```javascript
function getSign(number) {
    let sign = "";
    if (number > 0) {
        sign = "positive";
    } else if (number < 0) {
        sign = "negative";
    } else {
        sign = "neutral";
    }
    return sign;
}
```

### 3. line-end colon to indicate new block instead of curly brackets (if, while) []
##### Python
```python
i = 0
while i < 10:
    print(i)
    i += 1
```

##### Javascript
```javascript
let i = 0;
while (i < 10) {
    console.log(i);
    i++;
}
```


### 4. self instead of this [] + 5. no constructor, instead __init__ [] +
##### Python
```python
class Car(object):
    def __init__(self, make, year, color, is_used=False):
        self.make = make
        self.year = year
        self.color = color
        self.isUsed = isUsed
```

##### Javascript
```javascript
class Car {
    constructor(make, year, color, isUsed=false) {
        this.make = make;
        this.year = year;
        this.color = color;
        this.isUsed = isUsed;
    }
}
```


### 6. access modifiers for methods and properties []
##### Python
```python
class Car(object):
    def __init__(self, public_prop, protected_prop, private_prop):
        self.public_prop = public_prop
        self._protected_prop = protected_prop
        self.__private_prop = private_prop
```

##### Javascript
```javascript
// TODO: need help on this one
class Car {
    constructor(publicProp, protectedProp, privateProp) {
        this.publicProp = publicProp;
        // How does protected work? -> this.protectedProp = protectedProp;
        var privateProp = privateProp;
    }
}
```


### 7. string literals []
##### Python
```python
b = "Alpha" if name == "A" else "Other"
```

##### Javascript
```javascript
let b = (name == "A") ? "Alpha" : "Other";
```

### 8. AND []
##### Python
```python
b = True and False
```

##### Javascript
```javascript
let b = true && false;
```


### 9. OR []
##### Python
```python
b = True or False
```

##### Javascript
```javascript
let b = true || false;
```
