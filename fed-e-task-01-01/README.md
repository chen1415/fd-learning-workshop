### Js 异步编程

JavaScript 是一个单线程的语言 存在两种任务模式

- 同步模式 - Synchronous
- 异步模式 - Asynchronous

  

同步模式是阻塞式的 也就是说必须每一段代码的执行都必须等它上面那一段执行完了才能执行 

普通的语言一般都是这个模式

异步模式是非阻塞式的 也就是说一段代码的执行不必等候前面的代码执行完毕 

而会先执行第一段，然后转而执行其他任务，等做好了准备，再回过头执行第二段 比如读取文件进行处理

常见的比如setTimeOut就会触发这个异步操作



### 事件循环(Event loop) && 消息队列(Queue)

事件循环是是一个**程序结构**，用于等待和发送消息和事件

简单说，就是在程序中设置两个线程：

- 一个负责程序本身的运行，称为"主线程"

- 一个负责主线程与其他进程（主要是各种I/O操作）的通信，被称为"Event Loop线程"

    

![](https://i.loli.net/2020/09/28/8ugDL1UsnET9vVf.png)



消息队列是浏览器渲染引擎提供的类似数据结构的一个队列 遵循**先进先出**的规则  

如果执行栈里的任务执行完成，即执行栈为空的时候（即JS引擎线程空闲）事件触发线程会从消息队列取出一个任务（即异步的回调函数）放入执行栈中执行

执行完了后 执行栈再次为空 事件触发线程会重复上一步操作 再取出一个消息队列中的任务

如果说call stack是一个工作安排表 那么消息队列就是一个待办工作表 

事件循环就负责 当没有工作安排时把第一个待办放到工作安排表里  （任务会在队列里等待消息循环调用它）

![](https://i.loli.net/2020/09/28/6JCEaSr9sVKwFfk.png)



### 宏任务与微任务

- macro-task：主代码块、setTimeout、setInterval等（事件队列中的每一个事件都是一个 macro-task，现在称之为宏任务队列）
- micro-task：Promise、process.nextTick等

每次执行栈执行的代码就是一个宏任务，包括任务队列(宏任务队列)中的，因为执行栈中的宏任务执行完会去取任务队列（宏任务队列）中的任务加入执行栈中，即同样是事件循环的机制



**执行的顺序**:

1. 执行一个宏任务（栈中没有就从事件队列中获取）
2. 执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
3. 宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
4. 当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染
5. 渲染完毕后，JS引擎线程继续，开始下一个宏任务（从宏任务队列中获取）



**宏任务与微任务的区别**

- 宏队列可以有多个，微任务队列只有一个,所以每创建一个新的settimeout都是一个新的宏任务队列，执行完一个宏任务队列后，都会去checkpoint 微任务。
- 一个事件循环后，微任务队列执行完了，再执行宏任务队列
- 一个事件循环中，在执行完一个宏队列之后，就会去check 微任务队列

![](https://i.loli.net/2020/09/28/TetrwdRASB9mzhs.png)