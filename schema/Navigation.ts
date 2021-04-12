export type PageId =
  | ""
  | "discover"
  | "tweets"
  | "likes"
  | "followers"
  | "following"
  | "comments"
  | "profile";

export interface SidebarLinkI {
  href: string;
  id: PageId;
  text: string;
  svg: any;
}
