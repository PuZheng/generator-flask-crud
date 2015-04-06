# generator-flask-crud [![Build Status](https://secure.travis-ci.org/xiechao06/generator-flask-crud.png?branch=master)](https://travis-ci.org/xiechao06/generator-flask-crud)

> [Yeoman](http://yeoman.io) generator


## Getting Started

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```bash
npm install -g yo
```

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-flask-crud from npm, run:

```bash
npm install -g generator-flask-crud
```

Finally, initiate the generator:

```bash
yo flask-crud
```

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).


## License

MIT

## Features included

* keyword search in list, auto-complete is possible
* multiple filters are possible
* mobile friendly
* sort by columns
* operation logs
* default value from model definition
* default doc from model definition 
* online validation according to model definition

## Why?

Why it is a generator but a lib like [flask-admin](https://github.com/mrjoes/flask-admin/), the only reason is:

> CRUD are such common operations, every severe web developer should understand the internals. A thick library is inconvenient to hack. and unluckily, in most scenarios, it needs to be hacked
> to meet the requirements. Then it will be bloated with more and more config options, and finally make the view layer and control layer a mess. 

So, I make it the PART of the project (that you could modify easily and avoid repeating CRUD code again and again), but A LIBRARY underneath the project.

## How to develop based upon this skeleton.

before development, make sure you have read this article ["CRUD implementations - a modern way"]() carefully. and setup as the generator told.

### object list

    * add your filters (search for "filters" in "list.html") or just remove them if you have no filter.
