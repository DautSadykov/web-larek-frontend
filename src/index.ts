import './scss/styles.scss';
import { Api } from './components/base/api';

const api = new Api("https://larek-api.nomoreparties.co/content/weblarek")

console.log(api.get)
// console.log(1)