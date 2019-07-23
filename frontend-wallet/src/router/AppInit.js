import store from '../store'
// import {authService} from '../services'

export default (to, from, next) => {
	console.warn('now?')

	if (!store.state.loading.appLoading) {
		return next();
	}

	const accessToken = localStorage.getItem('accessToken');
	const refreshToken = localStorage.getItem('refreshToken');
	console.warn('token??????', accessToken);

	if (!accessToken) {
		store.dispatch('loading/setAppLoading', false);
		return next();
	}
	console.warn('token', accessToken);
	
	store.commit('auth/setAccessToken', accessToken);
	store.commit('auth/setRefreshToken', refreshToken);

	store.dispatch('loading/setLoading', true);
	store.dispatch('auth/authenticate')
  		.then(() => {
				store.dispatch('loading/setAppLoading', false);
				store.dispatch('loading/setLoading', false);
				next();
  		})
  		.catch((error) => {
			  console.warn('err!')
			  	console.warn(error)
				store.dispatch('loading/setAppLoading', false);
				store.dispatch('loading/setLoading', false);
				store.dispatch('auth/logout');
				next('/login');
  		})
}
