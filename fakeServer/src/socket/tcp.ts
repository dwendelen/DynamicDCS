import {lauxlib, lua} from "fengari";
import luaL_Reg = lauxlib.luaL_Reg;
import lua_State = lua.lua_State;
import lua_pushstring = lua.lua_pushstring;
import lua_pushnil = lua.lua_pushnil;
import lua_newuserdata = lua.lua_newuserdata;
import lua_pushnumber = lua.lua_pushnumber;
import luaL_optnumber = lauxlib.luaL_optnumber;
import {
	auxiliar_add2group,
	auxiliar_checkclass, auxiliar_checkgroup,
	auxiliar_newclass,
	auxiliar_setclass,
	auxiliar_tostring
} from "./auxiliar";
import {luaL_openlib} from "./compat";

let tcp: luaL_Reg[] = [
	{name: "__tostring", func: auxiliar_tostring},
	{name: "accept",     func: meth_accept},
	{name: "bind",       func: meth_bind},
	{name: "listen",     func: meth_listen},
	{name: "receive",    func: meth_receive},
	{name: "send",       func: meth_send},
	{name: "settimeout", func: meth_settimeout},
];

let func: luaL_Reg[] = [
	{name: "tcp", func: global_create}
];


/*-------------------------------------------------------------------------*\
* Initializes module
\*-------------------------------------------------------------------------*/
function tcp_open(L :lua_State): number
{
	/* create classes */
	auxiliar_newclass(L, "tcp{master}", tcp);
	auxiliar_newclass(L, "tcp{client}", tcp);
	auxiliar_newclass(L, "tcp{server}", tcp);
	/* create class groups */
	auxiliar_add2group(L, "tcp{master}", "tcp{any}");
	auxiliar_add2group(L, "tcp{client}", "tcp{any}");
	auxiliar_add2group(L, "tcp{server}", "tcp{any}");
	/* define library functions */
	luaL_openlib(L, null, func, 0);
	return 0;
}

/*=========================================================================*\
* Lua methods
\*=========================================================================*/
/*-------------------------------------------------------------------------*\
* Just call buffered IO methods
\*-------------------------------------------------------------------------*/
function meth_send(L: lua_State): number {
	let tcp = auxiliar_checkclass(L, "tcp{client}", 1);
	//todo return buffer_meth_send(L, &tcp->buf);
}

function meth_receive(L: lua_State): number {
	let tcp = auxiliar_checkclass(L, "tcp{client}", 1);
	//todo return buffer_meth_receive(L, &tcp->buf);
}


/*-------------------------------------------------------------------------*\
* Waits for and returns a client object attempting connection to the
* server object
\*-------------------------------------------------------------------------*/
function meth_accept( L: lua_State): number
{
	p_tcp server = (p_tcp) auxiliar_checkclass(L, "tcp{server}", 1);
	p_timeout tm = timeout_markstart(&server->tm);
	t_socket sock;
	int err = socket_accept(&server->sock, &sock, NULL, NULL, tm);
	/* if successful, push client socket */
	if (err == IO_DONE) {
		p_tcp clnt = (p_tcp) lua_newuserdata(L, sizeof(t_tcp));
		auxiliar_setclass(L, "tcp{client}", -1);
		/* initialize structure fields */
		socket_setnonblocking(&sock);
		clnt->sock = sock;
		io_init(&clnt->io, (p_send) socket_send, (p_recv) socket_recv,
			(p_error) socket_ioerror, &clnt->sock);
		timeout_init(&clnt->tm, -1, -1);
		buffer_init(&clnt->buf, &clnt->io, &clnt->tm);
		return 1;
	} else {
		lua_pushnil(L);
		lua_pushstring(L, socket_strerror(err));
		return 2;
	}
}

/*-------------------------------------------------------------------------*\
* Binds an object to an address
\*-------------------------------------------------------------------------*/
function meth_bind(L: lua_State): number
{
	p_tcp tcp = (p_tcp) auxiliar_checkclass(L, "tcp{master}", 1);
	const char *address =  luaL_checkstring(L, 2);
	unsigned short port = (unsigned short) luaL_checknumber(L, 3);
	const char *err = inet_trybind(&tcp->sock, address, port);
	if (err) {
		lua_pushnil(L);
		lua_pushstring(L, err);
		return 2;
	}
	lua_pushnumber(L, 1);
	return 1;
}



/*-------------------------------------------------------------------------*\
* Puts the sockt in listen mode
\*-------------------------------------------------------------------------*/
function meth_listen(L: lua_State): number
{
	let tcp = auxiliar_checkclass(L, "tcp{master}", 1);
	let backlog = luaL_optnumber(L, 2, 32);
	int err = socket_listen(&tcp->sock, backlog);
	if (err != IO_DONE) {
		lua_pushnil(L);
		lua_pushstring(L, socket_strerror(err));
		return 2;
	}
	/* turn master object into a server object */
	auxiliar_setclass(L, "tcp{server}", 1);
	lua_pushnumber(L, 1);
	return 1;
}



function meth_settimeout(L: lua_State): number
{
	let tcp = auxiliar_checkgroup(L, "tcp{any}", 1);
	return timeout_meth_settimeout(L, &tcp->tm);
}

/*=========================================================================*\
* Library functions
\*=========================================================================*/
/*-------------------------------------------------------------------------*\
* Creates a master tcp object
\*-------------------------------------------------------------------------*/
function global_create( L:lua_State): number
{
	t_socket sock;
	const char *err = inet_trycreate(&sock, SOCK_STREAM);
	/* try to allocate a system socket */
	if (!err) {
		/* allocate tcp object */
		p_tcp tcp = (p_tcp) lua_newuserdata(L, sizeof(t_tcp));
		/* set its type as master object */
		auxiliar_setclass(L, "tcp{master}", -1);
		/* initialize remaining structure fields */
		socket_setnonblocking(&sock);
		tcp->sock = sock;
		io_init(&tcp->io, (p_send) socket_send, (p_recv) socket_recv,
			(p_error) socket_ioerror, &tcp->sock);
		timeout_init(&tcp->tm, -1, -1);
		buffer_init(&tcp->buf, &tcp->io, &tcp->tm);
		return 1;
	} else {
		lua_pushnil(L);
		lua_pushstring(L, err);
		return 2;
	}
}
