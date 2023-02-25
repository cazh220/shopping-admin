import home from "./home"
import common from "./common"
import account from "./account"
import goods from "./goods"
import order from "./order"

const api = {
  ...account,
  ...goods,
  ...common,
  ...home,
  ...order
}
export default api
