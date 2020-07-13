import React from "react";

import { Route } from "react-router-dom";

import StopWatch from "./componets/Stopwatch";

import Login from "./componets/Login";

import Register from "./componets/Register";

function App() {
   return (
      <div>
         <div>
            <Route exact path='/' component={StopWatch} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Register} />
         </div>
      </div>
   );
}

export default App;
