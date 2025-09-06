export interface FileNode {
  name: string;
  type: 'file';
}

export interface DirectoryNode {
  name: string;
  type: 'directory';
  children: Node[];
}

export type Node = FileNode | DirectoryNode;
