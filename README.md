## Задание

### Создайте простой http server 

1. На GET /dir_name выведите в консоль - /home/...путь_к_папке_проекта
2. На GET /file_name выведите в консоль - /home/...путь_к_папке_проекта/имя_запускаемого_файла
3. На GET /cpus выведите в консоль массив с информацией о каждом логическом ядре процессора
4. На GET /number_of_cores выведите в консоль количество ядер
5. При открытии в браузере страницы http://localhost:8080/home.html должна выводиться надпись This is home page
6. На POST запрос с телом { password: 'supper-secure-password' }, сервер должен отвечать { isValid: true }, при любом другом пароле { isValid: false }.
На сервере проверку реализовать при помощи сравнения hash:
для генерации hash используйте [функцию]: https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest




| Parameter        | Value   |
| ------------- | ------------- |
| salt  | salt  |
|  iterations  |   100000  |
|  keylen  |  64  |
|  digest |    sha512 |

Buffer преобразуйте к строке с форматом hex
hash = 37e753db1079f7d8ff8d145769664df46b12d8c3a3c4930a2e66ab76a8bfb4ca9e0fe69b7bc40355755846342cf19c95c58fa538d964963f04aff409621ec330

