import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

Vue.use(VueApollo);


// 这里的地址写后端所在电脑的IP和端口号
const httpLink = new HttpLink({
  uri: 'http://localhost:10010/graphql',
});

//创建Apollo客户端
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export default new VueApollo({
  defaultClient: apolloClient,
})

