/**
 * The type of the custom tag's value. You can pass custom valid type in here which is supported by exif tag group.
 */
enum MetadataTagType {
  string = 'string',
}

type TagGroup = {
  InformationType: string;
  SpecificLocation: string;
};

export type MetadataTag = {
  /**
   * The name of the custom tag
   */
  name: string;
  type: MetadataTagType | any;
  group: TagGroup;
};

export type MetadataConfiguration = {
  /**
   * The default configuration use hex key data in files. If you want to use key name data, set this to explicitly false.
   */
  default?: boolean;
  tags: MetadataTag[];
  /**
   * The value of this variable must be greater than 53248. This is the default value of the first custom tag. Please don't change this value unless you know what you are doing.
   */
  sequence?: number;
};
