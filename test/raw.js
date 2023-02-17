import { __raw__cmd__ } from "../lib/utils/raw_exec.js";

__raw__cmd__("-j -q ~/home/404.jpg", (d) => console.log(1, d), {
    stay_open: false,
});
__raw__cmd__("-j -q /dir/test.pdf", (d) => console.log(2, d), {
    stay_open: false,
});
(() => {
    setTimeout(function () {
        __raw__cmd__(
            "-j -q /dir/test.pdf",
            function (d) {
                console.log(3, d);
            },
            {
                stay_open: true,
            }
        );
    }, 3000);
})();
