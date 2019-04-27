import {lua, lauxlib} from 'fengari';
import luaL_newmetatable = lauxlib.luaL_newmetatable;
import luaL_getmetatable = lauxlib.luaL_getmetatable;
import luaL_argerror = lauxlib.luaL_argerror;
import luaL_checkudata = lauxlib.luaL_checkudata;
import lua_State = lua.lua_State;
import luaL_Reg = lauxlib.luaL_Reg;
import lua_pushstring = lua.lua_pushstring;
import lua_newtable = lua.lua_newtable;
import lua_rawset = lua.lua_rawset;
import lua_pushjsfunction = lua.lua_pushjsfunction;
import lua_pop = lua.lua_pop;
import lua_getmetatable = lua.lua_getmetatable;
import lua_gettable = lua.lua_gettable;
import lua_istable = lua.lua_istable;
import lua_isstring = lua.lua_isstring;
import lua_error = lua.lua_error;
import lua_pushboolean = lua.lua_pushboolean;
import lua_isboolean = lua.lua_isboolean;
import lua_typename = lua.lua_typename;
import LUA_TBOOLEAN = lua.LUA_TBOOLEAN;
import lua_toboolean = lua.lua_toboolean;
import lua_setmetatable = lua.lua_setmetatable;
import lua_rawget = lua.lua_rawget;
import lua_isnil = lua.lua_isnil;
import lua_touserdata = lua.lua_touserdata;
import {luaL_typerror} from "./compat";


export function auxiliar_open(L: lua_State) {

}


export function auxiliar_newclass( L: lua_State, classname: string, funcs: luaL_Reg[]) {
	luaL_newmetatable(L, classname); /* mt */
	/* create __index table to place methods */
	lua_pushstring(L, "__index");    /* mt,"__index" */
	lua_newtable(L);                 /* mt,"__index",it */
	/* put class name into class metatable */
	lua_pushstring(L, "class");      /* mt,"__index",it,"class" */
	lua_pushstring(L, classname);    /* mt,"__index",it,"class",classname */
	lua_rawset(L, -3);               /* mt,"__index",it */
	/* pass all methods that start with _ to the metatable, and all others
     * to the index table */

	funcs.forEach(func => {
		lua_pushstring(L, func.name);
		lua_pushjsfunction(L, func.func);
		lua_rawset(L, func.name[0] == '_' ? -5: -3);
	});
	lua_rawset(L, -3);               /* mt */
	lua_pop(L, 1);
}

/*-------------------------------------------------------------------------*\
* Prints the value of a class in a nice way
\*-------------------------------------------------------------------------*/
export function auxiliar_tostring(L: lua_State) {
	if (lua_getmetatable(L, 1)) {
		lua_pushstring(L, "__index");
		lua_gettable(L, -2);
		if (lua_istable(L, -1)) {
			lua_pushstring(L, "class");
			lua_gettable(L, -2);
			if (lua_isstring(L, -1)) {
				return 1;
			}
		}
	}

	lua_pushstring(L, "invalid object passed to 'auxiliar.c:__tostring'");
	lua_error(L);
	return 1;
}

/*-------------------------------------------------------------------------*\
* Insert class into group
\*-------------------------------------------------------------------------*/
export function auxiliar_add2group(L: lua_State, classname: string, groupname: string) {
	luaL_getmetatable(L, classname);
	lua_pushstring(L, groupname);
	lua_pushboolean(L, 1);
	lua_rawset(L, -3);
	lua_pop(L, 1);
}

/*-------------------------------------------------------------------------*\
* Make sure argument is a boolean
\*-------------------------------------------------------------------------*/
export function auxiliar_checkboolean(L: lua_State, objidx: number): number {
	if (!lua_isboolean(L, objidx))
		luaL_typerror(L, objidx, lua_typename(L, LUA_TBOOLEAN));
	return lua_toboolean(L, objidx);
}

/*-------------------------------------------------------------------------*\
* Return userdata pointer if object belongs to a given class, abort with
* error otherwise
\*-------------------------------------------------------------------------*/
export function auxiliar_checkclass<T>(L: lua_State, classname: string, objidx): T {
	let data = auxiliar_getclassudata<T>(L, classname, objidx);
	if (!data) {
		let error = classname + " expected";
		luaL_argerror(L, objidx, error);
	}
	return data;
}

/*-------------------------------------------------------------------------*\
* Return userdata pointer if object belongs to a given group, abort with
* error otherwise
\*-------------------------------------------------------------------------*/
export function auxiliar_checkgroup<T>(L: lua_State, groupname: string, objidx: number): T {
	let data = auxiliar_getgroupudata<T>(L, groupname, objidx);
	if (!data) {
		let msg = groupname + " expected";
		luaL_argerror(L, objidx, msg);
	}
	return data;
}

/*-------------------------------------------------------------------------*\
* Set object class
\*-------------------------------------------------------------------------*/
export function auxiliar_setclass(L: lua_State, classname: string, objidx: number) {
	luaL_getmetatable(L, classname);
	if (objidx < 0) objidx--;
	lua_setmetatable(L, objidx);
}

/*-------------------------------------------------------------------------*\
* Get a userdata pointer if object belongs to a given group. Return NULL
* otherwise
\*-------------------------------------------------------------------------*/
export function auxiliar_getgroupudata<T>(L: lua_State, groupname: string, objidx: number): T | null {
	if (!lua_getmetatable(L, objidx))
		return null;
	lua_pushstring(L, groupname);
	lua_rawget(L, -2);
	if (lua_isnil(L, -1)) {
		lua_pop(L, 2);
		return null;
	} else {
		lua_pop(L, 2);
		return lua_touserdata(L, objidx);
	}
}

/*-------------------------------------------------------------------------*\
* Get a userdata pointer if object belongs to a given class. Return NULL
* otherwise
\*-------------------------------------------------------------------------*/
export function auxiliar_getclassudata<T>(L: lua_State, classname: string, objidx: number): T | null{
	return luaL_checkudata(L, objidx, classname);
}
