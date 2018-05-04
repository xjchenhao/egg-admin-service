// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  // const val = localStorage.getItem('authority');
  // return val ? val : 'guest';
  return localStorage.getItem('authority');
}

export function setAuthority(authority) {
  return localStorage.setItem('authority', authority);
}
