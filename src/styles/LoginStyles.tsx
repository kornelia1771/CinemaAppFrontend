import { colors, fontSizes } from '../constants/theme';

export const LoginSafeAreaContainer = () => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: colors.lightBackground,
    paddingBottom: '72px',
    boxSizing: 'border-box',
});

export const LoginCenterArea = () => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '6px',
});

export const LoginFormWrapper = () => ({
    width: '94%',
    maxWidth: '388px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    paddingLeft: '12px',
    paddingRight: '12px',
    backgroundColor: colors.white,
    paddingTop: '12px',
    paddingBottom: '12px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.12)',
});

export const LoginInnerContent = () => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px',
    boxSizing: 'border-box',
});

export const LoginTitleRow = () => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
});

export const LoginTitleText = () => ({
    fontSize: fontSizes.extra_large,
    fontWeight: '600',
    color: colors.black,
    marginLeft: '8px',
    marginMargin: 0,
});

export const LoginDescription = () => ({
    color: colors.grey,
    fontSize: fontSizes.medium,
    textAlign: 'center',
    marginBottom: '12px',
    marginLeft: '12px',
    marginRight: '12px',
});

export const LoginButtonContainer = () => ({
    width: '94%',
    maxWidth: '360px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    marginTop: '12px',
});

// ZMNIEJSZONO: Button podstawowy
export const LoginButton = () => ({
    backgroundColor: colors.black,
    paddingTop: '10px',        // Zmniejszono z 15px
    paddingBottom: '10px',     // Zmniejszono z 15px
    paddingLeft: '24px',        // Dostosowano proporcjonalnie z 30px
    paddingRight: '24px',       // Dostosowano proporcjonalnie z 30px
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
    textTransform: 'none',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.18)',
    '&:hover': {
        backgroundColor: colors.darkgrey,
    },
});

export const LoginButtonText = () => ({
    color: colors.white,
    fontSize: fontSizes.medium,
    fontWeight: '600',
});

export const LoginTitle = () => ({
    fontSize: fontSizes.mid_large,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: '16px',
    marginMargin: 0,
});

export const LoginFormScroll = () => ({
    width: '100%',
});

export const LoginFormScrollContent = () => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '4px',
    paddingBottom: '16px',
});

export const LoginFormContainer = () => ({
    width: '100%',
    maxWidth: '360px',
    marginBottom: 0,
    padding: '0px 16px 16px 16px',
    borderRadius: '10px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
});

export const LoginLabelRow = () => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '6px',
});

export const LoginInputLabel = () => ({
    color: colors.black,
    fontSize: fontSizes.small,
    marginBottom: '6px',
    fontWeight: '700',
    alignSelf: 'flex-start',
});

// ZMNIEJSZONO: Wysokość zwykłego inputu poprzez mniejszy padding pionowy
export const LoginInput = () => ({
    width: '100%',
    backgroundColor: colors.lightgrey,
    borderRadius: '8px',
    paddingLeft: '15px',
    paddingRight: '15px',
    paddingTop: '8px',          // Zmniejszono z 12px
    paddingBottom: '8px',       // Zmniejszono z 12px
    marginBottom: '15px',
    fontSize: fontSizes.medium,
    color: colors.black,
    boxSizing: 'border-box',
});

export const LoginPasswordInputWrapper = () => ({
    width: '100%',
    position: 'relative',
    marginBottom: '4px',
});

// ZMNIEJSZONO: Wysokość inputu hasła poprzez mniejszy padding pionowy
export const LoginPasswordInputField = () => ({
    width: '100%',
    backgroundColor: colors.lightgrey,
    borderRadius: '8px',
    paddingLeft: '15px',
    paddingRight: '44px',
    paddingTop: '8px',          // Zmniejszono z 12px
    paddingBottom: '8px',       // Zmniejszono z 12px
    fontSize: fontSizes.medium,
    color: colors.black,
    boxSizing: 'border-box',
});

// DOPASOWANO: Pozycja absolutna kontenera ikony oka, aby idealnie pasowała do niższego pola
export const LoginPasswordToggleAbsolute = () => ({
    position: 'absolute',
    right: '8px',               // Przesunięto delikatnie bliżej krawędzi (z 12px) dla lepszego wyglądu przy mniejszej skali
    top: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: '6px',
    paddingRight: '6px',
    zIndex: 2,
});

export const LoginForgotInline = () => ({
    color: colors.black,
    fontSize: fontSizes.small,
    textDecoration: 'none',
    fontWeight: '700',
});

export const LoginValidationContainer = () => ({
    width: '100%',
    minHeight: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: 0,
});

export const LoginValidationError = () => ({
    color: colors.red,
    fontSize: fontSizes.small,
    fontWeight: '700',
    textAlign: 'center',
});

// ZMNIEJSZONO: Główny przycisk logowania/rejestracji
export const LoginSignInButton = () => ({
    backgroundColor: colors.black,
    paddingTop: '10px',        // Zmniejszono z 15px
    paddingBottom: '10px',     // Zmniejszono z 15px
    paddingLeft: '24px',        // Dostosowano proporcjonalnie z 30px
    paddingRight: '24px',       // Dostosowano proporcjonalnie z 30px
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px',
    textTransform: 'none',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.18)',
    '&:hover': {
        backgroundColor: '#1f2937',
    },
});

export const LoginSignInButtonDisabled = () => ({
    opacity: 1,
    backgroundColor: colors.darkgrey,
    cursor: 'not-allowed',
    '&:hover': {
        backgroundColor: colors.darkgrey,
    },
});

export const LoginSignInButtonText = () => ({
    color: colors.white,
    fontSize: fontSizes.medium,
    fontWeight: '600',
});

export const LoginDividerContainer = () => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: '14px',
    marginBottom: '14px',
});

export const LoginDividerLine = () => ({
    flex: 1,
    height: '1px',
    backgroundColor: colors.lightgrey,
});

export const LoginDividerText = () => ({
    marginLeft: '12px',
    marginRight: '12px',
    color: colors.darkgrey,
    fontSize: fontSizes.small,
    textTransform: 'lowercase',
});

export const LoginDevButtonsCol = () => ({
    width: '100%',
    maxWidth: '360px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
});

export const LoginFieldError = () => ({
    color: colors.red,
    fontSize: fontSizes.small,
    fontWeight: '700',
    marginTop: '-6px',
    marginBottom: '8px',
    alignSelf: 'flex-start',
});

export const LoginPasswordRequirement = (isValid: boolean) => ({
    marginLeft: '6px',
    color: isValid ? colors.green : colors.red,
    fontSize: fontSizes.small,
    fontWeight: '700',
});

export const LoginPasswordRequirementRow = () => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '2px',
    width: '100%',
});