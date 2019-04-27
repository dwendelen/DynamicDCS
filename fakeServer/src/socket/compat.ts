/**
 @license MIT

 Copyright © 2019 Daan Wendelen
 Copyright © 1994–2017 Lua.org, PUC-Rio.
 */

import {lauxlib, lua, luastring_indexOf, to_luastring} from "fengari";

import lua_State = lua.lua_State;
import lua_pushfstring = lua.lua_pushfstring;
import luaL_typename = lauxlib.luaL_typename;
import luaL_argerror = lauxlib.luaL_argerror;
import lua_register = lua.lua_register;
import luaL_Reg = lauxlib.luaL_Reg;
import luaL_checkversion = lauxlib.luaL_checkversion;
import lua_insert = lua.lua_insert;
import luaL_setfuncs = lauxlib.luaL_setfuncs;
import lua_pop = lua.lua_pop;
import LUA_REGISTRYINDEX = lua.LUA_REGISTRYINDEX;
import LUA_LOADED_TABLE = lauxlib.LUA_LOADED_TABLE;
import lua_getfield = lua.lua_getfield;
import LUA_TTABLE = lua.LUA_TTABLE;
import lua_pushglobaltable = lua.lua_pushglobaltable;
import luaL_error = lauxlib.luaL_error;
import lua_pushvalue = lua.lua_pushvalue;
import lua_setfield = lua.lua_setfield;
import lua_remove = lua.lua_remove;
import lua_pushlstring = lua.lua_pushlstring;
import lua_rawget = lua.lua_rawget;
import lua_createtable = lua.lua_createtable;
import lua_settable = lua.lua_settable;
import lua_istable = lua.lua_istable;
import LUA_TNIL = lua.LUA_TNIL;

export function luaL_typerror (L: lua_State, narg: number, tname: string | Uint8Array): number {
	let msg = lua_pushfstring(L, "%s expected, got %s", tname, luaL_typename(L, narg));
	return luaL_argerror(L, narg, msg);
}

export function luaL_openlib ( L:lua_State, libname: string | Uint8Array, l: luaL_Reg[], nup: number): void{
	luaL_checkversion(L);
	if (libname) {
		luaL_pushmodule(L, libname, libsize(l));  /* get/create library table */
		lua_insert(L, -(nup + 1));  /* move library table to below upvalues */
	}
	if (l)
		luaL_setfuncs(L, l, nup);
	else
		lua_pop(L, nup);  /* remove upvalues */
}

function libsize (l: luaL_Reg[] | null): number {
	let size = 0;
	for (let i = 0; l && l[i].name; i++) size++;
	return size;
}

export function luaL_pushmodule (L: lua_State, modname: string | Uint8Array, sizehint: number): void {
	luaL_findtable(L, LUA_REGISTRYINDEX, LUA_LOADED_TABLE, 1);
	if (lua_getfield(L, -1, modname) != LUA_TTABLE) {  /* no LOADED[modname]? */
		lua_pop(L, 1);  /* remove previous result */
		/* try global variable (and create one if it does not exist) */
		lua_pushglobaltable(L);
		if (luaL_findtable(L, 0, modname, sizehint) != null)
			luaL_error(L, "name conflict for module '%s'", modname);
		lua_pushvalue(L, -1);
		lua_setfield(L, -3, modname);  /* LOADED[modname] = new table */
	}
	lua_remove(L, -2);  /* remove LOADED table */
}

export function luaL_findtable (L:lua_State, idx: number, fname: string | Uint8Array, szhint: number): Uint8Array | null {
	let fnameAsLua = from_userstring(fname);
	let e: number;
	let pfname = 0;
	if (idx) lua_pushvalue(L, idx);

	do {
		e = luastring_indexOf(fnameAsLua, '.'.charCodeAt(0), pfname);
		if (e == -1) e = fnameAsLua.length;
		lua_pushlstring(L, fnameAsLua.subarray(pfname), e - pfname);
		if (lua_rawget(L, -2) == LUA_TNIL) {  /* no such field? */
			lua_pop(L, 1);  /* remove this nil */
			lua_createtable(L, 0, (fnameAsLua[e] == '.'.charCodeAt(0) ? 1 : szhint)); /* new table for field */
			lua_pushlstring(L, fnameAsLua.subarray(pfname), e - pfname);
			lua_pushvalue(L, -2);
			lua_settable(L, -4);  /* set new table into field */
		}
		else if (!lua_istable(L, -1)) {  /* field has a non-table value? */
			lua_pop(L, 2);  /* remove table and value */
			return fnameAsLua.subarray(pfname);  /* return problematic part of the name */
		}
		lua_remove(L, -2);  /* remove previous table */
		pfname = e + 1;
	} while (fnameAsLua[e] == '.'.charCodeAt(0));
	return null;
}

function from_userstring(str: any): Uint8Array {
	if (!is_luastring(str)) {
		if (typeof str === "string") {
			str = to_luastring(str);
		} else {
			throw new TypeError("expects an array of bytes or javascript string");
		}
	}
	return str;
}

function is_luastring(s: any): boolean {
	return s instanceof Uint8Array;
}
