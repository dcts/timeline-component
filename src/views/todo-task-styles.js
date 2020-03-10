import {css} from 'lit-element/lit-element.js';

export const style = css`
  .dot {
    height: 25px;
    width: 25px;
    background-color: #eee;
    border-radius: 50%;
    display: inline-block;
    margin-right: 12px;
  }
  .dot.active {
    background-color: rgba(31,104,244,0.6) !important;
  }
  div.task {
    margin-bottom: 7px;
    display: flex;
    cursor: pointer;
  }
  div.task:hover .dot {
    background-color: #ddd;
  }
`;
