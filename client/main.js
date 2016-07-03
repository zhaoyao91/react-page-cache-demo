import {FlowRouter} from 'meteor/kadira:flow-router';
import React from 'react';
import createCacheManager from 'react-page-cache';
import ReactDOM from 'react-dom';

// create a cache manager
// yes, you can create many cache managers to scope different sets of pages
const manager = createCacheManager();

// mount cache renderer
ReactDOM.render(
    manager.renderer,
    document.getElementById('root')
);

// define your pages

class TestA extends React.Component {
    render() {
        return <div>
            Page A
        </div>
    }
}

class TestB extends React.Component {
    render() {
        return <div>
            Page B
        </div>
    }
}

class TestC extends React.Component {
    render() {
        // how to pass props to page? we'll see it soon
        const {name, age} = this.props;
        return <div>
            Page C
            <p>Name: {name}</p>
            <p>Age: {age}</p>
        </div>
    }
}

// activate some page when something happens (usually with route events as below)

FlowRouter.route('/a', {
    action() {
        // activate your page with a unique id
        manager.activatePage({
            id: 'a',
            page: ()=><TestA/>
        })
    }
});

FlowRouter.route('/b', {
    action(params, query) {
        manager.activatePage({
            id: 'b',
            page: ()=><TestB/>,

            // look here, you can specify cache time for individual pages (how to set global cache time? keep reading!)
            cacheTime: 3000
        })
    }
});

FlowRouter.route('/c', {
    action(params, query) {
        manager.activatePage({
            id: 'c',

            // now you know how to pass arguments to page!
            args: {
                name: query.name,
                age: query.age
            },
            page: (args)=><TestC {...args}/>

            // hey, don't try to pass arguments directly into page instance!
            // always let the arguments go though the manager, it will cache them
            // when the page is inactive, and thus preventing 'changes behind your eyes'

            // don't do this, unless you know what you're doing
            // pages: ()=><TestC {...query}/>
        })
    }
});

// as I promised before, you can set some global options

manager.GlobalOptions.cacheTime = 5000;
manager.GlobalOptions.cacheLimit = 2; // aha, you can justify how many pages it can cache at most

// what's more? supporting page switch animations should be, eh, not difficult, I think. But now I am going to sleep. If you have good idea, LET ME KNOW PLEASE @~@

// if you are tired of seeing your ugly page, call `manager.inactivatePages()`