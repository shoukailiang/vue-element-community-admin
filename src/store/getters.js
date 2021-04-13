const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,

  init: state => state.role.init,
  roleId: state => state.role.roleId,
}
export default getters
