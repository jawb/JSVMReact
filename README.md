#JSVM 2

A few years ago when I was taking the compiler course, we had to build an Algol 68 in C. The compiler needed to generate bytecode for a stack machine VM that was written in C. We didn't have much time and we had to deliver the project so we used the same VM and just added some features to it.

Afterwards I decided to build an easy VM to replace the C version which was lacking a lot of features, so I came up with [JSVM](https://github.com/jawb/JSVM) which was my top Github/HN success. It's nothing fancy just the minimal js code to make the VM run correctly and provide easy traveling.

A few months I started rewriting JSVM in ES6 using React and Redux, I tried to write clean functional code and make most component stateless. The UI is also much better, I did my best to keep the design simple and clean. Testing is not yet finished, adding tests after writing the app is always a bad idea but we keep doing it. It's a very good exercise though, many parts of the app are rewritten when you found out that they're not testable.

I hope this helps students taking compiler courses, or serve as a tiny example of a React app.
