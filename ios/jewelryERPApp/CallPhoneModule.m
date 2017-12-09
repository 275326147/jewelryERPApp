#import "CallPhoneModule.h"
#import <Foundation/Foundation.h>

@implementation CallPhoneModule

RCT_EXPORT_MODULE(CallPhoneModule);

RCT_EXPORT_METHOD(callPhone: (NSString *)phone){
  NSMutableString * str = [[NSMutableString alloc] initWithFormat:@"telprompt://%@",phone];
  [[UIApplication sharedApplication] openURL:[NSURL URLWithString:str]];
}

@end
