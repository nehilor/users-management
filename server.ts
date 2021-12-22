import app from './src/app';
import { CommonFunctions } from './src/common/common-functions';
import { PrintColorType } from './src/enums/print-color-type.enum';

const port = process.env.PORT || 8080;
//const port = 9998;
let listenServer = app.listen(port, (): void => {
  console.log(
    'users db-connection'.concat(' is listening on port ' + port.toString())
  );
});

export { listenServer };
