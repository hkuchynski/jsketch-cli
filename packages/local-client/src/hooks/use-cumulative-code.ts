import { useTypedSelector } from './use-typed-selector';

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);

    const showFunc = `
      import _React from 'react';
      import _ReactDOM from 'react-dom/client';
      var show = (value) => {
        const root = document.querySelector('#root');

        if (typeof value === 'object') {
          if (value.$$typeof && value.props) {
            const reactRoot = _ReactDOM.createRoot(root); 
            const div = root.appendChild(document.createElement("div"));
            div.textContent = reactRoot.render(value);
     
          } else {
            const div = root.appendChild(document.createElement("div"));
            div.textContent = JSON.stringify(value);
          }
        } else {
          const div = root.appendChild(document.createElement("div"));
          div.textContent = value;
        }
      };
    `;
    const showFuncNoop = 'var show = () => { return "" }';
    const cumulativeCode = [];
    for (let c of orderedCells) {
      if (c.type === 'code') {
        if (c.id === cellId) {
          cumulativeCode.push(showFunc);
        } else {
          cumulativeCode.push(showFuncNoop);
        }
        cumulativeCode.push(c.content);
      }
      if (c.id === cellId) {
        break;
      }
    }
    return cumulativeCode;
  }).join('\n');
};
