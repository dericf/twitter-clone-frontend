export type PageId =
  | ""
  | "discover"
  | "tweets"
  | "likes"
  | "followers"
  | "following"
  | "comments"
  | "messages"
  | "profile";

export interface SidebarLinkI {
  href: string;
  id: PageId;
  text: string;
  svg: any;
}
