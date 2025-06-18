function toDom(data) {
  if (typeof data === 'string') {
    const ele = document.createElement('p');
    ele.textContent = data;
    return ele;
  }
  if (typeof data === 'object' && !Array.isArray(data)) {
    const ele = document.createElement('div');
    for (const key in data) {
      const elesub = document.createElement('div');
      ele.appendChild(elesub);
      const title = document.createElement('p');
      title.classList.add('info-name');
      title.textContent = key;
      elesub.appendChild(title);
      const content = toDom(data[key]);
      if (content.tagName === 'P') {
        elesub.classList.add('final');
      }
      elesub.appendChild(content);
    }
    ele.classList.add('info-group');
    return ele;
  }
  if (Array.isArray(data)) {
    const ele = document.createElement('ul');
    for (const item of data) {
      const li = document.createElement('li');
      li.appendChild(toDom(item));
      ele.appendChild(li);
    }
    return ele;
  }
}
function toPreCode(text) {
  const contentPre = document.createElement('pre');
  const content = document.createElement('code');
  contentPre.appendChild(content);
  Promise.resolve(text).then((t) => {
    content.textContent = t;
  });
  return contentPre;
}
function showTexts(texts) {
  const ele = document.createElement('div');
  ele.classList.add('log-box');

  for (const { name, text } of texts) {
    const elelog = document.createElement('div');
    const title = document.createElement('p');
    title.classList.add('log-title');
    title.textContent = name;
    elelog.appendChild(title);

    elelog.appendChild(toPreCode(text));
    ele.appendChild(elelog);
  }
  return ele;
}
const DomMap = {
  'logs': (data) => showTexts(
    data.map((i) => ({
      name: i,
      text: fetch('/logs/' + i).then((res) => res.text()),
    }))
  ),
  'dotBuildInfoFile': (data) => toPreCode(data),
};
(async () => {
  const info = await (await fetch('/buildInfo.json')).json();
  info['dotBuildInfoFile'] = fetch('/.buildinfo').then((res) => res.text());
  const main = document.getElementById('build-info-content');
  
  for (const key in info) {
    const ele = document.createElement('h2');
    ele.textContent = key.charAt(0).toUpperCase() + key.slice(1);
    main.appendChild(ele);
    if (key in DomMap) {
      main.appendChild(DomMap[key](info[key]));
    } else {
      main.appendChild(toDom(info[key]));
    }
  }
})();
