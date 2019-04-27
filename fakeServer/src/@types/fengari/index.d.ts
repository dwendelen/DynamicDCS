//TODO: if in- or output is Uint8Array -> check if null is also allowed
declare const FENGARI_AUTHORS;
declare const FENGARI_COPYRIGHT;
declare const FENGARI_RELEASE;
declare const FENGARI_VERSION;
declare const FENGARI_VERSION_MAJOR;
declare const FENGARI_VERSION_MINOR;
declare const FENGARI_VERSION_NUM;
declare const FENGARI_VERSION_RELEASE;

export function luastring_eq(a: Uint8Array, b: Uint8Array): boolean

// s.indexOf(v, i)
export function luastring_indexOf(s: Uint8Array, v: number, i?: number): number

export function luastring_of(...items: number[]): Uint8Array

export function to_jsstring(value: Uint8Array, from?: number, to?: number, replacement_char?: boolean): string

export function to_luastring(str: string, cache?: boolean): Uint8Array

export function to_uristring(a: Uint8Array): string

declare namespace lua {
	type lua_State = any;
	type lua_KContext = any;
	type lua_Integer = number;
	type lua_KFunction = (L: lua_State, status: number, ctx: lua_KContext) => number;

	type lua_JSFunction = (L: lua_State) => number;
	type lua_Writer<T> = (L: lua_State, p: Uint8Array, sz: number, ud: T) => number
	type lua_Reader<T> = (L: lua_State, data: T, size: number) => Uint8Array
	type lua_Hook = (L: lua_State, ar: lua_Debug) => void
	type lua_Number = number;

	const LUA_AUTHORS;
	const LUA_COPYRIGHT;
	const LUA_ERRERR;
	const LUA_ERRGCMM;
	const LUA_ERRMEM;
	const LUA_ERRRUN;
	const LUA_ERRSYNTAX;
	const LUA_HOOKCALL;
	const LUA_HOOKCOUNT;
	const LUA_HOOKLINE;
	const LUA_HOOKRET;
	const LUA_HOOKTAILCALL;
	const LUA_MASKCALL;
	const LUA_MASKCOUNT;
	const LUA_MASKLINE;
	const LUA_MASKRET;
	const LUA_MINSTACK;
	const LUA_MULTRET;
	const LUA_NUMTAGS;
	const LUA_OK;
	const LUA_OPADD;
	const LUA_OPBAND;
	const LUA_OPBNOT;
	const LUA_OPBOR;
	const LUA_OPBXOR;
	const LUA_OPDIV;
	const LUA_OPEQ;
	const LUA_OPIDIV;
	const LUA_OPLE;
	const LUA_OPLT;
	const LUA_OPMOD;
	const LUA_OPMUL;
	const LUA_OPPOW;
	const LUA_OPSHL;
	const LUA_OPSHR;
	const LUA_OPSUB;
	const LUA_OPUNM;
	const LUA_REGISTRYINDEX;
	const LUA_RELEASE;
	const LUA_RIDX_GLOBALS;
	const LUA_RIDX_LAST;
	const LUA_RIDX_MAINTHREAD;
	const LUA_SIGNATURE;
	const LUA_TNONE;
	const LUA_TNIL;
	const LUA_TBOOLEAN;
	const LUA_TLIGHTUSERDATA;
	const LUA_TNUMBER;
	const LUA_TSTRING;
	const LUA_TTABLE;
	const LUA_TFUNCTION;
	const LUA_TUSERDATA;
	const LUA_TTHREAD;
	const LUA_VERSION;
	const LUA_VERSION_MAJOR;
	const LUA_VERSION_MINOR;
	const LUA_VERSION_NUM;
	const LUA_VERSION_RELEASE;
	const LUA_YIELD;

	interface lua_Debug {
		event: number
		name: string
		namewhat: string
		what: string
		source: string
		currentline: number
		linedefined: number
		lastlinedefined: number
		nups: number
		nparams: number
		isvararg: number
		istailcall: number
		short_src: any //TODO
	}

	function lua_upvalueindex(i: number): number

	function lua_absindex(L: lua_State, idx: number): number

	function lua_arith(L: lua_State, op: number): number

	function lua_atpanic(L: lua_State, panicf: lua_JSFunction): lua_JSFunction

	function lua_atnativeerror(L: lua_State, errorf: lua_JSFunction): lua_JSFunction

	function lua_call(L: lua_State, nargs: number, nresults: number): void

	function lua_callk(L: lua_State, nargs: number, nresults: number, ctx: lua_KContext, k: lua_KContext): void //todo
	function lua_checkstack(L: lua_State, n: number): number

	function lua_close(L: lua_State): void

	function lua_compare(L: lua_State, index1: number, index2: number, op: number): number

	function lua_concat(L: lua_State, n: number): void

	function lua_copy(L: lua_State, fromidx: number, toidx: number): void

	function lua_createtable(L: lua_State, narr: number, nrec: number): void

	function lua_dump<T>(L: lua_State, writer: lua_Writer<T>, data: T, strip: number): number

	function lua_error(L: lua_State)

	//Only for compatibility
	function lua_gc(L?: lua_State, what?: number, data?: number): number

	//Only for compatibility
	function lua_getallocf(L?: lua_State, ud?: any): number

	//Only for compatibility
	function lua_getextraspace(L?: lua_State): number

	function lua_getfield(L: lua_State, index: number, k: string | Uint8Array): number

	function lua_getglobal(L: lua_State, name: string | Uint8Array): number

	function lua_gethook(L: lua_State): lua_Hook

	function lua_gethookcount(L: lua_State): number

	function lua_gethookmask(L: lua_State): number

	function lua_geti(L: lua_State, index: number, i: lua_Integer): number

	function lua_getinfo(L: lua_State, what: string | Uint8Array, ar: lua_Debug): number

	function lua_getlocal(L: lua_State, ar: lua_Debug, n: number): Uint8Array | null

	function lua_getmetatable(L: lua_State, index: number): number

	function lua_getstack(L: lua_State, level: number, ar: lua_Debug): number

	function lua_gettable(L: lua_State, index: number): number

	function lua_gettop(L: lua_State): number

	function lua_getupvalue(L: lua_State, funcindex: number, n: number): Uint8Array

	function lua_getuservalue(L: lua_State, index: number): number

	function lua_insert(L: lua_State, index: number): void

//------
	function lua_isboolean(L: lua_State, index: number): number

	function lua_iscfunction(L: lua_State, index: number): number

	function lua_isfunction(L: lua_State, index: number): number

	function lua_isinteger(L: lua_State, index: number): number

	function lua_islightuserdata(L: lua_State, index: number): number

	function lua_isnil(L: lua_State, index: number): number

	function lua_isnone(L: lua_State, index: number): number

	function lua_isnoneornil(L: lua_State, index: number): number

	function lua_isnumber(L: lua_State, index: number): number

	function lua_isproxy(p: any, L: lua_State): boolean //TODO

	function lua_isstring(L: lua_State, index: number): number

	function lua_istable(L: lua_State, index: number): number

	function lua_isthread(L: lua_State, index: number): number

	function lua_isuserdata(L: lua_State, index: number): number

	function lua_isyieldable(L: lua_State): number

	function lua_len(L: lua_State, index: number): void

	function lua_load<T>(L: lua_State, reader: lua_Reader<T>, data: T, chunkname: string | Uint8Array, mode: string | Uint8Array): number

	function lua_newstate(f?: any, ud?: any): lua_State

	function lua_newtable(L: lua_State): void

	function lua_newthread(L: lua_State): lua_State

	function lua_newuserdata(L: lua_State, size: number): {}

	function lua_next(L: lua_State, index: number): number

	function lua_numbertointeger(n: lua_Number): lua_Integer | false

	function lua_pcall(L: lua_State, nargs: number, nresults: number, msgh: number): number

	function lua_pcallk(L: lua_State, nargs: number, nresults: number, msgh: number, ctx: lua_KContext, k: lua_KFunction): number

	function lua_pop(L: lua_State, n: number): void

	function lua_pushboolean(L: lua_State, b: boolean): void

	function lua_pushcclosure(L: lua_State, fn: lua_JSFunction, n: number): void

	function lua_pushcfunction(L: lua_State, f: lua_JSFunction): void

	function lua_pushfstring(L: lua_State, fmt: string | Uint8Array, ...argp: any[]): Uint8Array

	function lua_pushglobaltable(L: lua_State): void

	function lua_pushinteger(L: lua_State, n: lua_Integer): void

	function lua_pushjsclosure(L: lua_State, fn: lua_JSFunction, n: number): void

	function lua_pushjsfunction(L: lua_State, f: lua_JSFunction): void

	function lua_pushlightuserdata(L: lua_State, p: any): void

	function lua_pushliteral(L: lua_State, s: string | Uint8Array): Uint8Array

	function lua_pushlstring(L: lua_State, s: string | Uint8Array, len: number): Uint8Array

	function lua_pushnil(L: lua_State): void

	function lua_pushnumber(L: lua_State, n: lua_Number): void; //todo
	function lua_pushstring(L: lua_State, s: string | Uint8Array | null): Uint8Array | null

	function lua_pushthread(L: lua_State): number;

	function lua_pushvalue(L: lua_State, index: number): void

	function lua_pushvfstring(L: lua_State, fmt: string | Uint8Array, argp: any[]): Uint8Array //todo
	function lua_rawequal(L: lua_State, index1: number, index2: number): number

	function lua_rawget(L: lua_State, index: number): number

	function lua_rawgeti(L: lua_State, index: number, n: lua_Integer): number

	function lua_rawgetp(L: lua_State, index: number, p: any): number

	function lua_rawlen(L: lua_State, index: number): number

	function lua_rawset(L: lua_State, index: number): void

	function lua_rawseti(L: lua_State, index: number, i: lua_Integer): void

	function lua_rawsetp(L: lua_State, index: number, p: any): void

	function lua_register(L: lua_State, name: string | Uint8Array, f: lua_JSFunction): void

	function lua_remove(L: lua_State, index: number): void

	function lua_replace(L: lua_State, index: number): void

	function lua_resume(L: lua_State, from: lua_State, nargs: number): number

	function lua_rotate(L: lua_State, idx: number, n: number): void

//Only for compatibility
	function lua_setallof(L?: lua_State, f?: any, ud?: any): void

	function lua_setfield(L: lua_State, index: number, k: string | Uint8Array): void

	function lua_setglobal(L: lua_State, name: string | Uint8Array): void

	function lua_sethook(L: lua_State, f: lua_Hook, mask: number, count: number): void

	function lua_seti(L: lua_State, index: number, n: lua_Integer);

	function lua_setlocal(L: lua_State, ar: lua_Debug, n: number): Uint8Array

	function lua_setmetatable(L: lua_State, index: number): void

	function lua_settable(L: lua_State, index: number): void

	function lua_settop(L: lua_State, index: number): void

	function lua_setupvalue(L: lua_State, funcindex: number, n: number): Uint8Array

	function lua_setuservalue(L: lua_State, index: number): void

	function lua_status(L: lua_State): number

	function lua_stringtonumber(L: lua_State, s: Uint8Array): number

	function lua_toboolean(L: lua_State, index: number): boolean

	function lua_todataview(L: lua_State, index: number): DataView

	function lua_tointeger(L: lua_State, index: number): lua_Integer

	function lua_tointegerx(L: lua_State, index: number): lua_Integer | false

	function lua_tojsstring(L: lua_State, index: number): string | null

	function lua_tolstring(L: lua_State, index: number): Uint8Array

	function lua_tonumber(L: lua_State, index: number): lua_Number

	function lua_tonumberx(L: lua_State, index: number): lua_Number | false

	function lua_topointer(L: lua_State, index: number): any

	function lua_toproxy(L: lua_State, idx: number): any

	function lua_tostring(L: lua_State, index: number): Uint8Array;

	function lua_tothread(L: lua_State, index: number): lua_State;

	function lua_touserdata(L: lua_State, index: number): any

	function lua_type(L: lua_State, index: number): number

	function lua_typename(L: lua_State, tp: number): Uint8Array

	function lua_upvalueid(L: lua_State, funcindex: number, n: number): any //todo
	function lua_upvaluejoin(L: lua_State, funcindex1: number, n1: number, funcindex2: number, n2: number): void

	function lua_version(L: lua_State): lua_Number

	function lua_xmove(L: lua_State, to: lua_State, n: number): void

	function lua_yield(L: lua_State, nresults: number): number

	function lua_yieldk(L: lua_State, nresults: number, ctx: lua_KContext, k: lua_KFunction): number

	function lua_tocfunction(L: lua_State, index: number): lua_JSFunction
}

declare namespace lauxlib {
	import lua_JSFunction = lua.lua_JSFunction;
	import lua_State = lua.lua_State;
	import lua_Integer = lua.lua_Integer;
	import lua_Number = lua.lua_Number;

	interface luaL_Reg {
		name: string,
		func: lua_JSFunction
	}

	type luaL_Buffer = any

	const LUA_ERRFILE;
	const LUA_FILEHANDLE;
	const LUA_LOADED_TABLE;
	const LUA_NOREF;
	const LUA_PRELOAD_TABLE;
	const LUA_REFNIL;


	function luaL_addchar(B: luaL_Buffer, c: number): void

	function luaL_addlstring(B: luaL_Buffer, s: string | Uint8Array, l: number): void

	function luaL_addsize(B: luaL_Buffer, n: number): void

	function luaL_addstring(B: luaL_Buffer, s: string | Uint8Array): void

	function luaL_addvalue(B: luaL_Buffer): void

	function luaL_argcheck(L: lua_State, cond: number, arg: number, extramsg: string | Uint8Array): void

	function luaL_argerror(L: lua_State, arg: number, extramsg: string | Uint8Array): number

	function luaL_buffinit(L: lua_State, B: luaL_Buffer): void

	function luaL_buffinitsize(L: lua_State, b: luaL_Buffer, sz: number): Uint8Array

	function luaL_callmeta(L: lua_State, obj: number, e: string | Uint8Array): number

	function luaL_checkany(L: lua_State, arg: number): void

	function luaL_checkinteger(L: lua_State, ang: number): lua_Integer

	function luaL_checklstring(L: lua_State, arg: number, l?: any): Uint8Array

	function luaL_checknumber(L: lua_State, arg: number): lua_Number

	function luaL_checkoption(L: lua_State, arg: number, def: string | Uint8Array, lst: Uint8Array[]): number

	function luaL_checkstack(L: lua_State, sz: number, msg: string | Uint8Array): void

	function luaL_checkstring(L: lua_State, arg: number): Uint8Array

	function luaL_checktype(L: lua_State, arg: number, t: number): void

	function luaL_checkudata(L: lua_State, arg: number, tname: string | Uint8Array): void

	function luaL_checkversion(L: lua_State)

	function luaL_checkversion_(L: lua_State, v: lua_Number, sz: number): void

	function luaL_dofile(L: lua_State, filename: string | Uint8Array): number

	function luaL_dostring(L: lua_State, str: string | Uint8Array): number

	function luaL_error(L: lua_State, fmt: string | Uint8Array, ...argp: any[]): number


	function luaL_execresult(L: lua_State, e: { status: any, signal: any, errno: any }): number //todo

	function luaL_fileresult(L: lua_State, stat: number, fname: string | Uint8Array, e: { errno: any }): number //todo

	function luaL_getmetafield(L: lua_State, obj: number, e: string | Uint8Array): number

	function luaL_getmetatable(L: lua_State, tname: string | Uint8Array): number

	function luaL_getsubtable(L: lua_State, idx: number, fname: string | Uint8Array): number

	function luaL_gsub(L: lua_State, s, p, r): Uint8Array //todo check string types

	function luaL_len(L: lua_State, index: number): lua_Integer

	function luaL_loadbuffer(L: lua_State, buff: Uint8Array, sz: number, name: string | Uint8Array): number

	function luaL_loadbufferx(L: lua_State, buff: Uint8Array, sz: number, name: string | Uint8Array, mode: string | Uint8Array): number

	function luaL_loadfile(L: lua_State, filename: string | Uint8Array): number

	function luaL_loadfilex(L: lua_State, filename: string | Uint8Array, mode: string | Uint8Array): number

	function luaL_loadstring(L: lua_State, s: string | Uint8Array): number

	function luaL_newlib(L: lua_State, l: luaL_Reg[]): void

	function luaL_newlibtable(L: lua_State, l: luaL_Reg[]): void

	function luaL_newmetatable(L: lua_State, tname: string | Uint8Array): number

	function luaL_newstate(): lua_State

	function luaL_opt<A, R>(L: lua_State, func: (L: lua_State, arg: A) => R, arg: A, dflt: R): R

	function luaL_optinteger(L: lua_State, arg: number, d: lua_Integer): lua_Integer

	function luaL_optlstring(L: lua_State, arg: number, d: string | null | Uint8Array, l?: number): Uint8Array | null

	function luaL_optnumber(L: lua_State, arg: number, d: lua_Number): lua_Number

	function luaL_optstring(L: lua_State, arg: number, d: string | null | Uint8Array, l?: number): Uint8Array | null

	function luaL_prepbuffer(B: luaL_Buffer): Uint8Array

	function luaL_prepbuffsize(B: luaL_Buffer, sz: number): Uint8Array

	function luaL_pushresult(B: luaL_Buffer): void

	function luaL_pushresultsize(B: luaL_Buffer, sz: number): void

	function luaL_ref(L: lua_State, t: number): number

	function luaL_requiref(L: lua_State, modname: string | Uint8Array, openf: lua_JSFunction, glb: number): void

	function luaL_setfuncs(L: lua_State, l: luaL_Reg[], nup: number): void

	function luaL_setmetatable(L: lua_State, tname: string | Uint8Array): void

	function luaL_testudata(L: lua_State, arg: number, tname: string | Uint8Array): void

	function luaL_tolstring(L: lua_State, idx: number): Uint8Array

	function luaL_traceback(L: lua_State, L1: lua_State, msg: string | Uint8Array, level: number): void

	function luaL_typename(L: lua_State, index: number): Uint8Array

	function luaL_unref(L: lua_State, t: number, ref: number): void

	function luaL_where(L: lua_State, level: number): void

	function lua_writestringerror(): void
}

declare namespace lualib {
	import lua_State = lua.lua_State;

	const LUA_BITLIBNAME;
	const LUA_COLIBNAME;
	const LUA_DBLIBNAME;
	const LUA_FENGARILIBNAME;
	const LUA_IOLIBNAME;
	const LUA_LOADLIBNAME;
	const LUA_MATHLIBNAME;
	const LUA_OSLIBNAME;
	const LUA_STRLIBNAME;
	const LUA_TABLIBNAME;
	const LUA_UTF8LIBNAME;
	const LUA_VERSUFFIX;

	function lua_assert(c: any): void

	function luaopen_base(L: lua_State): number

	function luaopen_coroutine(L: lua_State): number

	function luaopen_debug(L: lua_State): number

	function luaopen_fengari(L: lua_State): number

	function luaopen_io(L: lua_State): number

	function luaopen_math(L: lua_State): number

	function luaopen_os(L: lua_State): number

	function luaopen_package(L: lua_State): number

	function luaopen_string(L: lua_State): number

	function luaopen_table(L: lua_State): number

	function luaopen_utf8(L: lua_State): number


	function luaL_openlibs(L: lua_State): void
}
