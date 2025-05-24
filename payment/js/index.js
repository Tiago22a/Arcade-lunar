const PUBLIC_KEY = "APP_USR-fd35b4c6-d231-4c17-88fa-437dcc01c44f";

function initMercadoPago() {
	const preferenceId = urlSearchParams.get("preference");

    const mp = new MercadoPago(PUBLIC_KEY);

    const bricksBuilder = mp.bricks();
    const renderWalletBrick = async (bricksBuilder) => {
        await bricksBuilder.create("wallet", "walletBrick_container", {
            initialization: {
                preferenceId: preferenceId,
            }
        });
    };

    renderWalletBrick(bricksBuilder);
}

const urlSearchParams = new URLSearchParams(window.location.search);

initMercadoPago();