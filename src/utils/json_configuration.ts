/*
%Image::ExifTool::UserDefined = (
    'Image::ExifTool::PDF::Info' => {
		d000 => {
        Name => 'Test_tag',
        Writable => 'string',
    },
	},
);
1;

*/

const _ = [
  {
    'PDF::Info': {
      d000: {
        Name: 'Test_tag',
        Writable: {
          string: 'hello',
        },
      },
    },
  },
];
console.log(_);
/*
PDF::Info
 d000


*/
