/**
 * Routes resource/action pairs to their module handlers.
 */
const ROUTE_HANDLERS = {
  auth: Auth,
  users: Users,
  patients: Patients,
  queue: Queue,
  examinations: Examinations,
  reminders: Reminders,
  finance: Finance,
  employees: Employees,
  attendance: Attendance,
  reports: Reports,
  content: Content
};

const Router = {
  dispatch(request) {
    var resource = request.resource;
    var action = request.action;

    if (!resource) {
      throw new Error('Missing "resource" parameter');
    }

    const handler = ROUTE_HANDLERS[resource];
    if (!handler) {
      throw new Error(`Resource handler not found for "${resource}"`);
    }

    const normalizedAction = action || 'list';
    if (typeof handler[normalizedAction] !== 'function') {
      throw new Error(`Action "${normalizedAction}" is not supported for resource "${resource}"`);
    }

    const result = handler[normalizedAction](request);
    if (result && typeof result === 'object' && 'success' in result) {
      return result;
    }

    return Response.build(true, '', result);
  }
};
