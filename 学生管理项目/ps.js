function initStyle(listDom, className, targetDom) {
    for (var i = 0; i < listDom.length; i++) {
        listDom[i].classList.remove(className);
    }
    targetDom.classList.add(className);
}
initStyle(oDD, 'active', e.target);
initStyle(contentActive, 'content-active', rightContent);