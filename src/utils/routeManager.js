class RouteManager {
  constructor() {
    this.routes = [];
  }

  addRoute(server, method, route, ...controllers) {
    console.log('Add route with controller', route, controllers);
    server[method](route, ...controllers);
    for (const controller of controllers) {
      this.routes.push({
        method,
        route,
        controller,
      });
    }
  }

  listRoutes() {
    for (const route of this.routes) {
      console.log('Method:', route.method, 'Route:', route.route, 'Controller:', route.controller);
    }
  }
}

module.exports = RouteManager;
