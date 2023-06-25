import getBeUrl from "./getBeUrl";



const profilePictureDefault = (picture: string | null | undefined): string => {
  return (picture === undefined || picture === null) ? "/static/profilovka.png" : `${getBeUrl()}/static/${picture}`;
}



export default profilePictureDefault;