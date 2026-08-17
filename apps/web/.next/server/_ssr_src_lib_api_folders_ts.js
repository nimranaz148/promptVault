"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_ssr_src_lib_api_folders_ts";
exports.ids = ["_ssr_src_lib_api_folders_ts"];
exports.modules = {

/***/ "(ssr)/./src/lib/api/folders.ts":
/*!********************************!*\
  !*** ./src/lib/api/folders.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   foldersApi: () => (/* binding */ foldersApi)\n/* harmony export */ });\n/* harmony import */ var _client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./client */ \"(ssr)/./src/lib/api/client.ts\");\n// Folders API — card organization (backend completion item).\n\nconst foldersApi = {\n    list: ()=>_client__WEBPACK_IMPORTED_MODULE_0__.api.get(\"/folders\"),\n    create: (name)=>_client__WEBPACK_IMPORTED_MODULE_0__.api.post(\"/folders\", {\n            name\n        }),\n    update: (id, name)=>_client__WEBPACK_IMPORTED_MODULE_0__.api.patch(`/folders/${id}`, {\n            name\n        }),\n    remove: (id)=>_client__WEBPACK_IMPORTED_MODULE_0__.api.delete(`/folders/${id}`)\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9zcmMvbGliL2FwaS9mb2xkZXJzLnRzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNkRBQTZEO0FBRTlCO0FBR3hCLE1BQU1DLGFBQWE7SUFDeEJDLE1BQU0sSUFBTUYsd0NBQUdBLENBQUNHLEdBQUcsQ0FBVztJQUU5QkMsUUFBUSxDQUFDQyxPQUFpQkwsd0NBQUdBLENBQUNNLElBQUksQ0FBUyxZQUFZO1lBQUVEO1FBQUs7SUFFOURFLFFBQVEsQ0FBQ0MsSUFBWUgsT0FBaUJMLHdDQUFHQSxDQUFDUyxLQUFLLENBQVMsQ0FBQyxTQUFTLEVBQUVELEdBQUcsQ0FBQyxFQUFFO1lBQUVIO1FBQUs7SUFFakZLLFFBQVEsQ0FBQ0YsS0FBZVIsd0NBQUdBLENBQUNXLE1BQU0sQ0FBTyxDQUFDLFNBQVMsRUFBRUgsR0FBRyxDQUFDO0FBQzNELEVBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcm9tcHR2YXVsdC13ZWIvLi9zcmMvbGliL2FwaS9mb2xkZXJzLnRzPzUzYzkiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gRm9sZGVycyBBUEkg4oCUIGNhcmQgb3JnYW5pemF0aW9uIChiYWNrZW5kIGNvbXBsZXRpb24gaXRlbSkuXG5cbmltcG9ydCB7IGFwaSB9IGZyb20gXCIuL2NsaWVudFwiO1xuaW1wb3J0IHR5cGUgeyBGb2xkZXIgfSBmcm9tIFwiQC90eXBlc1wiO1xuXG5leHBvcnQgY29uc3QgZm9sZGVyc0FwaSA9IHtcbiAgbGlzdDogKCkgPT4gYXBpLmdldDxGb2xkZXJbXT4oXCIvZm9sZGVyc1wiKSxcblxuICBjcmVhdGU6IChuYW1lOiBzdHJpbmcpID0+IGFwaS5wb3N0PEZvbGRlcj4oXCIvZm9sZGVyc1wiLCB7IG5hbWUgfSksXG5cbiAgdXBkYXRlOiAoaWQ6IHN0cmluZywgbmFtZTogc3RyaW5nKSA9PiBhcGkucGF0Y2g8Rm9sZGVyPihgL2ZvbGRlcnMvJHtpZH1gLCB7IG5hbWUgfSksXG5cbiAgcmVtb3ZlOiAoaWQ6IHN0cmluZykgPT4gYXBpLmRlbGV0ZTx2b2lkPihgL2ZvbGRlcnMvJHtpZH1gKSxcbn07XG4iXSwibmFtZXMiOlsiYXBpIiwiZm9sZGVyc0FwaSIsImxpc3QiLCJnZXQiLCJjcmVhdGUiLCJuYW1lIiwicG9zdCIsInVwZGF0ZSIsImlkIiwicGF0Y2giLCJyZW1vdmUiLCJkZWxldGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./src/lib/api/folders.ts\n");

/***/ })

};
;