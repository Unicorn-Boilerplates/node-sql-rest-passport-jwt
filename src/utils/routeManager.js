class RouteManager {
  constructor() {
    this.routes = [];
  }

  addRoute(server, method, route, controller) {
    server[method](route, controller);
    this.routes.push({
      method,
      route,
      controller,
    });
  }

  listRoutes() {
    for (const route of this.routes) {
      console.log('Method:', route.method, 'Route:', route.route, 'Controller:', route.controller);
    }
  }
}

module.exports = RouteManager;
