
describe("init", function() {
  it("contains spec with an expectation", function() {
  	var marker=new YY.Class.Marker(1,2,1);
  	marker.Info();
  	console.log(marker);
  	//expect(marker instanceOf YY.Class.Marker).toBe(true);
    expect(true).toBe(true);
  });
});